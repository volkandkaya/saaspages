import { graphql } from 'gatsby'
import get from 'lodash/get'
import Img from 'gatsby-image'
import React from 'react'

import { siteMetadata } from '../../gatsby-config'
import Layout from 'components/Layout'
import Meta from 'components/Meta'
import Icon from 'components/Icon'

class Roadmap extends React.Component {
  render() {
    const { location, data } = this.props;
    const data_blocks = get(data, 'remark.blocks')
    const blocks = data_blocks.map(block => block.block.frontmatter);

    return (
      <Layout location={location} blocks={data_blocks} hideFooter>
        <Meta site={siteMetadata} title="About" />
        <section>
          <div className="container mt-5 pt-5">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <h1>Roadmap</h1>
                <ul>
                  <li>Login</li>
                  <li>Save as favorite</li>
                  <li>Request a site</li>
                  <li><s>Filter by site</s></li>
                  <li><s>Filter by industry</s></li>
                  <li>Filter by funding (Bootstrap/VC)</li>
                  <li>Have multiple blocks of the same site from different time periods</li>
                  <li>Add relevant articles to each block</li>
                  <li>Guide on building each block</li>
                </ul>
              </div>
            </div>
          </div>

        </section>
      </Layout>
    )
  }
}

export default Roadmap

export const pageQuery = graphql`
  query RoadmapQuery {
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
  }
`
