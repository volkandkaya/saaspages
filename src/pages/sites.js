import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import { Lightbox } from 'react-modal-image'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import queryString from 'query-string'

import Post from 'templates/Post'
import Meta from 'components/Meta'
import Layout from 'components/Layout'
import Icon from 'components/Icon'
import ImageModal from 'components/ImageModal'
import CategoriesSelect from 'components/CategoriesSelect'
import { blockToDisplayBlockName } from '../constants/blocks'
import { getCategories } from '../utils/helpers'


const blockButtonStyle = {
  height: '200px',
  widht: '150px',
  backgroundColor: '#fff'
}

const Sites = ({ data, location, navigate }) => {
  const [company, setCompany] = useState('')
  const [ss, setSS] = useState(null)
  const [qC, setQC] = useState([])
  const [scrollY, setScrollY] = useState(0)

  const data_blocks = get(data, 'remark.blocks')
  const blocks = data_blocks.map(block => block.block.frontmatter)
  const sites = data.allSitesJson.edges
  const siteNames = sites.map(site => site.siteName)

  let allQueryCategories = {}

  sites.map(site => {
    allQueryCategories[site.node.category.toLowerCase()] = site.node.category
  })

  allQueryCategories = Object.keys(allQueryCategories).map(key => {
    return {value: key, label: allQueryCategories[key]}
  })
  allQueryCategories = sortBy(allQueryCategories, 'value')

  const categories = getCategories(sites)
  const search = location.search ? queryString.parse(location.search) : {}
  let queryCategories = search.categories ? search.categories.split(',') : []
  queryCategories = queryCategories.map(c => c.toLowerCase())

  queryCategories = queryCategories.filter(q => {
    const allQs = allQueryCategories.map(allQ => allQ.value)
    return allQs.includes(q)
  })

  useEffect(() => {
    if (qC.length === 0 && queryCategories.length > 0) {
      setQC(queryCategories)
    }
  }, []);

  const listener = e => {
    setScrollY(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener("scroll", listener)
    return () => {
      window.removeEventListener("scroll", listener);
    }

    if (!isEqual(qC, queryCategories)) {
      navigate('/sites/?categories=' + qC.join(','))
      queryCategories = qC
      window.scroll(0, scrollY)
    }
  });

  let filteredSites = sites
  if (queryCategories.length > 0) {
    filteredSites = sites.filter(site => {
      return queryCategories.includes(site.node.category.toLowerCase())
    })
  }
  const filteredSiteNames = filteredSites.map(site => site.node.siteName)

  if (queryCategories.length === 0 && location.search !== '') {
    navigate(location.pathname)
  }

  const screenshots = data.allScreenshotsJson.edges.filter(ss => {
    const {blockName, siteName} = ss.screenshotData
    return blockName === 'Headers' && filteredSiteNames.includes(siteName) && siteName.toLowerCase().includes(company.toLowerCase())
  })

  const handleCompanyChange = e => {
    setCompany(e.target.value)
  }

  return (
    <Layout location={location} blocks={data_blocks}>
      <Meta site={get(data, 'site.meta')} title="Sites"/>
      {ss ? <ImageModal
          ss={ss}
          onClose={() => setSS(null)}
          screenshots={screenshots}
          setSS={setSS}
          filterName='siteName'
          /> : null}
      <section className="mt-5">
          <div className="container mt-5 pt-5">
            <h1 className="display-3 text-primary font-weight-bold">Sites</h1>
            <p className="text-muted">All sites on SaaS Pages</p>
          </div>
        </section>

      <section id="screenshots" className="bg-light-blue pt-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-md-6">
                <h3>Search by Company</h3>
                <input className="form-control" value={company} placeholder="Company Name" onChange={handleCompanyChange}/>
              </div>
              <div className="col-md-6">
                <h3>Filter by Categories</h3>
                <CategoriesSelect
                  options={allQueryCategories}
                  queryCategories={queryCategories}
                  setQC={setQC}
                />
              </div>
            </div>
            <div className="row">
              {screenshots.map(ss => {
                const {siteName, date, blockName, imageName} = ss.screenshotData
                const ss_url = `/img/ss/${siteName}/${date}/${blockName}/${imageName}`
                return (
                  <div key={ss_url} className="col-md-6" onClick={() => setSS(ss)}>
                    <Link to={`/sites/${siteName.toLowerCase()}`}>
                      <h3>{siteName}</h3>
                    </Link>
                    <LazyLoadImage
                      className="img-pulse"
                      alt={`${siteName} ${blockToDisplayBlockName[blockName]} Block`}
                      src={`${ss_url}*700.jpg`}
                      placeholderSrc={`${ss_url}*blur.jpg`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

    </Layout>
  )
}

export default Sites

export const sitesQuery = graphql`
  query SitesQuery {
    site {
      meta: siteMetadata {
        title
        description
        url: siteUrl
        author
        twitter
        adsense
      }
    }
    remark: allMarkdownRemark(
      sort: { fields: [frontmatter___title], order: DESC }
      filter: {
        frontmatter: {
          layout: {
            in: ["block"]
          }
        }
      }
    ) {
      blocks: edges {
        block: node {
          html
          frontmatter {
            layout
            title
            path
            icon
            category
            tags
            description
            date(formatString: "YYYY/MM/DD")
            image {
              childImageSharp {
                fixed(width: 500) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
      }
    }
    allScreenshotsJson {
      edges {
        screenshotData: node {
          siteName
          date
          blockName
          imageName
        }
      }
    }
    allSitesJson {
      edges {
        node {
          siteName
          url
          category
        }
      }
    }
  }
`
