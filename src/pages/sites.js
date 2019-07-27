import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import React, { useState } from 'react'
import get from 'lodash/get'
import {Lightbox} from 'react-modal-image'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import Post from 'templates/Post'
import Meta from 'components/Meta'
import Layout from 'components/Layout'
import Icon from 'components/Icon'
import ImageModal from 'components/ImageModal'
import { blockToDisplayBlockName } from '../constants/blocks'


const blockButtonStyle = {
  height: '200px',
  widht: '150px',
  backgroundColor: '#fff'
}

const Sites = ({ data, location }) => {
  const [ss, setSS] = useState(null)
  const data_blocks = get(data, 'remark.blocks')
  const blocks = data_blocks.map(block => block.block.frontmatter);
  const sites = data.allSitesJson.edges;
  const siteNames = sites.map(site => site.siteName)
  const screenshots = data.allScreenshotsJson.edges.filter(ss => ss.screenshotData.blockName === 'Headers');
  console.log(ss);

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
        }
      }
    }
  }
`
