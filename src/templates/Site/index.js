import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import React, { useState } from 'react'
import get from 'lodash/get'
import sampleSize from 'lodash/sampleSize';
import {Lightbox} from 'react-modal-image'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import Post from 'templates/Post'
import Meta from 'components/Meta'
import Layout from 'components/Layout'
import Icon from 'components/Icon'
import ImageModal from 'components/ImageModal'
import { blockToDisplayBlockName } from '../../constants/blocks'


const blockButtonStyle = {
  height: '200px',
  widht: '150px',
  backgroundColor: '#fff'
}

const Site = ({ data, location }) => {
  const [ss, setSS] = useState(null);
  const siteName = location.pathname.replace('/sites/', '');
  const data_blocks = get(data, 'remark.blocks')
  const blocks = data_blocks.map(block => block.block.frontmatter);
  const sites = data.allSitesJson.edges;
  const siteNames = sites.map(site => site.node.siteName)
  const displaySiteName = siteNames.find(site => site.toLowerCase() === siteName)
  const screenshots = data.allScreenshotsJson.edges.filter(ss => ss.screenshotData.siteName.toLowerCase() === siteName);
  const someBlocks = sampleSize(blocks, 6)

  return (
    <Layout location={location} blocks={data_blocks}>
      <Meta site={get(data, 'site.meta')} />
      {ss ? <ImageModal ss={ss} onClose={() => setSS(null)}/> : null}
      <section >
          <div className="container mt-5 pt-5">
            <h1 className="display-3 text-primary font-weight-bold">{displaySiteName}</h1>
            <p className="text-muted">All blocks from {displaySiteName}</p>
          </div>
        </section>

      <section id="screenshots">
          <div className="container">
            <div className="row">
              {screenshots.map(ss => {
                const {siteName, date, blockName, imageName} = ss.screenshotData
                const ss_url = `/img/ss/${siteName}/${date}/${blockName}/${imageName}`
                const displayBlockName = blockToDisplayBlockName[blockName]
                return (
                  <div key={ss_url} className="col-md-6" onClick={() => setSS(ss)}>
                    <Link to={`/blocks/${displayBlockName.toLowerCase()}`}>{displayBlockName}</Link>
                    <LazyLoadImage
                      className="img-pulse"
                      alt={`${siteName} ${displayBlockName} Block`}
                      src={`${ss_url}*700.jpg`}
                      placeholderSrc={`${ss_url}*blur.jpg`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        <section className="bg-dark text-white text-center py-5 mt-5">
          <h2 className="display-4 font-weight-bolder">Here are some blocks</h2>
          <div className="container mt-5">
          <div className="row">
            {someBlocks.map(block => {
              return <div className="col-md-2" >
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
  )
}

export default Site

export const siteQuery = graphql`
  query SiteQuery {
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
