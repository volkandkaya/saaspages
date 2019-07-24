import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import React from 'react'
import get from 'lodash/get'

import Post from 'templates/Post'
import Meta from 'components/Meta'
import Layout from 'components/Layout'
import Icon from 'components/Icon'
import { blocksOrder } from '../constants/blocks'

const blockButtonStyle = {
  height: '200px',
  widht: '150px',
  backgroundColor: '#fff'
}

const Index = ({ data, location }) => {
  const data_blocks = get(data, 'remark.blocks')
  const blocks = data_blocks.map(block => block.block.frontmatter);
  return (
    <Layout location={location} blocks={data_blocks}>
      <Meta site={get(data, 'site.meta')} />
      <div className="container-fluid py-5 my-5">
        <div className="row">
          <div className="col text-center">
            <h1 className="display-2 font-weight-bolder text-primary">SaaS Pages</h1>
            <p className="lead">A collection of the best landing pages with a focus on copywriting and design.</p>
          </div>
        </div>
      </div>
      <div className="container-fluid py-4 bg-light-blue">
        <div className="row">
          <div className="col-md-4 offset-md-4 text-center">
            <h1 className="display-4 font-weight-bolder text-primary">Blocks</h1>
            <p>Each block lists the best practices to convert the most visitors to customers. There's also helpful articles and screenshots from the top landing pages! </p>
          </div>
        </div>
      </div>

      <section className="bg-light-blue pb-5">
      <div className="container bg-light-blue">
        <div className="row">
          {blocksOrder.map(block => {
            block = blocks.filter(b => b.title === block)[0]
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
  )
}

export default Index

export const pageQuery = graphql`
  query IndexQuery {
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
