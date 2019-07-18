import { graphql } from 'gatsby'
import get from 'lodash/get'
import Img from 'gatsby-image'
import React from 'react'

import { siteMetadata } from '../../gatsby-config'
import Layout from 'components/Layout'
import Meta from 'components/Meta'
import Icon from 'components/Icon'

class Profile extends React.Component {
  render() {
    const { location, data } = this.props;
    const data_blocks = get(data, 'remark.blocks')
    const blocks = data_blocks.map(block => block.block.frontmatter);

    return (
      <Layout location={location} blocks={data_blocks} hideFooter>
        <Meta site={siteMetadata} title="Profile" />
        <section>
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <h1>About</h1>
                <p className="mt-3">
                  Hey, I'm <a href="https://twitter.com/volkandkaya" target="_blank">Volkan Kaya</a>, a developer turned founder from London, UK - creator of SaaS Pages!
                  <br /><br />
                  While working on <a href="https:/versoly.com/?ref=saaspages">Versoly</a> a SaaS landing page builder, I had to build great landing pages. I wanted an easy way to see how other SaaS landing pages were designed, laid out and most importantly their copywriting.
                  <br /><br />
                  The aim of this website is to help myself and SaaS companies build the best landing pages so that they can convert visitors to paying customers.
                  <br /><br />
                  I had this idea in my head for a while but seeing great websites on Product Hunt gave me the push I needed to create it.
                  <br /><br />
                  Please checkout <a href="https://www.checklist.design" target="_blank">Checklist Design</a> I borrowed a lot from this website. Also <a href="https://webframe.xyz/" target="_blank">Webframe</a> he was able to build the site in under a week and rank number 1 on Product Hunt.
                </p>
              </div>
            </div>
          </div>

        </section>
      </Layout>
    )
  }
}

export default Profile

export const pageQuery = graphql`
  query AboutQuery {
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
