import { graphql, Link } from 'gatsby'
import get from 'lodash/get'
import React, { Fragment, useEffect, useState } from 'react'
import sampleSize from 'lodash/sampleSize'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import queryString from 'query-string'

import Icon from 'components/Icon'
import Meta from 'components/Meta'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Lightbox } from 'react-modal-image'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import ImageModal from 'components/ImageModal'
import CategoriesSelect from 'components/CategoriesSelect'
import { blockToDisplayBlockName, displayToBlockName } from '../constants/blocks'
import { getCategories } from '../utils/helpers'

const blockButtonStyle = {
  height: '200px',
  widht: '150px',
  backgroundColor: '#fff'
}

const Block = ({ data, location, navigate }) => {
  const [company, setCompany] = useState('')
  const [ss, setSS] = useState(null)
  const [qC, setQC] = useState([])
  const [scrollY, setScrollY] = useState(0)

  const blocks = get(data, 'remark.blocks')
  const block = get(data, 'block.frontmatter')
  const {blockData} = get(data, 'allBlocksJson.edges').filter(b => b.blockData.blockName === block.title)[0]
  const screenshotData = get(data, 'allScreenshotsJson.edges').filter(ss => blockToDisplayBlockName[ss.screenshotData.blockName] === block.title)

  const someBlocks = sampleSize(blocks.map(block => block.block.frontmatter), 6)
  const screenshots = data.allScreenshotsJson.edges.filter(ss => blockToDisplayBlockName[ss.screenshotData.blockName] === block.title);


  const sites = data.allSitesJson.edges
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
      navigate(`${location.pathname}?categories=${qC.join(',')}`)
      queryCategories = qC
    }
  });

  let filteredSites = sites
  if (queryCategories.length > 0) {
    filteredSites = sites.filter(site => {
      return queryCategories.includes(site.node.category.toLowerCase())
    })
  }
  const filteredSiteNames = filteredSites.map(site => site.node.siteName)

  const filteredScreenshotData = screenshotData.filter(ss => ss.screenshotData.siteName.toLowerCase().includes(company.toLowerCase()))

  const filteredScreenshots = screenshots.filter(ss => ss.screenshotData.siteName.toLowerCase().includes(company.toLowerCase()))

  if (queryCategories.length === 0 && location.search !== '') {
    navigate(location.pathname)
  }

  const handleCompanyChange = e => {
    setCompany(e.target.value)
  }

  return(
    <div>
      {ss ? <ImageModal
          ss={ss}
          onClose={() => setSS(null)}
          screenshots={filteredScreenshots}
          setSS={setSS}
          filterName='siteName'
          /> : null}
      <Layout location={location} blocks={blocks}>
        <Meta
          title={block.title + " Block"}
          site={get(data, 'site.meta')}
        />
        <section>
          <div className="container mt-5 pt-5">
            <FontAwesomeIcon icon={["fas", block.icon]} className="fa-4x text-primary" />
            <h1 className="display-3 text-primary font-weight-bold">{block.title}</h1>
            <p className="text-muted">Block</p>
          </div>
        </section>
        <section className="bg-light-blue pb-5">
          <div className="container pt-5">
            <div className="row">
              <div className="col-md-7">
                <h2 className="text-primary font-weight-bold display-4">Best Practices</h2>
                <p className="text-muted mt-n2">Following this advice will increase conversion rates.</p>
                {blockData.bestPractices.map(b => {
                  return (
                    <div className="card mr-md-5 mt-2">
                      <div className="card-body">
                        {b}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="col-md-5">
                <h2 className="text-primary font-weight-bold display-4">Resources</h2>
                <p className="text-muted mt-n2">Learn from the best</p>
                <div className="card mr-md-5 mt-2">
                  <div className="card-body">
                    <b>Real examples to be inspired</b>
                    <div className="row mt-3">
                      {blockData.examples.map(sn => {
                        const ss = screenshotData.filter(ss => ss.screenshotData.siteName === sn && blockToDisplayBlockName[ss.screenshotData.blockName] === block.title)[0];
                        const {siteName, blockName} = ss.screenshotData;
                        const src = `/img/ss/${siteName}/7-7-2019/${blockName}/${siteName}_${blockName}_01*700.jpg`

                        return (
                          <div className="col-md-6" onClick={() => setSS(ss)}>
                            <img className="img-fluid rounded-lg" src={src} alt={src} />
                          </div>
                        )
                      })}
                    </div>
                    <a href="#screenshots">See more examples</a>
                  </div>
                </div>
                {false ? <div className="card mr-md-5 mt-3">
                  <div className="card-body">
                    <b>Research and articles to read</b>
                        {blockData.content.map(b => {
                          return (
                            <a
                              className="text-dark row mt-3"
                              href={b.href}
                              target="_blank"
                              rel="noreferrer">
                              <div className="col-md-3">
                                <img className="mr-1" src={b.img.src} alt={b.img.alt} width={50} height={50} />
                              </div>
                              <div className="col-md-9">
                                <span className="">
                                <p className="mb-0">{b.title}</p>
                                <small className="text-muted">{b.author}</small>
                              </span>
                              </div>
                              <hr className="w-100 mx-3 my-2"/>
                            </a>
                          )
                        })}
                  </div>
                </div> : null}
              </div>
            </div>
          </div>
        </section>
        <section id="screenshots" className="mt-5 pb-5">
          <div className="container mt-3">
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
              {filteredScreenshotData.map(ss => {
                const {siteName, date, blockName, imageName} = ss.screenshotData
                const ss_url = `/img/ss/${siteName}/${date}/${blockName}/${imageName}`
                return (
                  <div className="col-md-6" onClick={() => setSS(ss)}>
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
        <section className="bg-dark text-white text-center py-5">
          <h2 className="display-4 font-weight-bolder">Here are some other blocks</h2>
          <div className="container mt-5">
          <div className="row">
            {someBlocks.map(block => {
              return <div key={block.title} className="col-md-2" >
                  <Link className="p-2 border my-2 btn w-100" style={blockButtonStyle} to={block.path}>
                    <Icon prefix="fas" name={block.icon} />
                    <h5>{block.title}</h5>
                  </Link>
                </div>
            })}
          </div>
          </div>
        </section>
      </Layout>
    </div>
  )
}
export default Block

export const blockQuery = graphql`
  query BlockByPath($path: String!) {
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
    block: markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        layout
        title
        path
        icon
      }
    }
    allBlocksJson {
      edges {
        blockData: node {
          blockName
          bestPractices
          examples
          content {
            href
            title
            author
            img {
              src
              alt
              href
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
  }
`
