const each = require('lodash/each')
const path = require('path')
const realFs = require('fs')
const gracefulFs = require('graceful-fs')
const BlockTemplate = path.resolve('./src/templates/block.js')
const PostTemplate = path.resolve('./src/templates/index.js')
const SiteTemplate = path.resolve('./src/templates/Site/index.js')

gracefulFs.gracefulify(realFs)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allFile(filter: { extension: { regex: "/md|js/" } }, limit: 1000) {
              edges {
                node {
                  id
                  name: sourceInstanceName
                  path: absolutePath
                  remark: childMarkdownRemark {
                    id
                    frontmatter {
                      layout
                      path
                    }
                  }
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
      ).then(({ errors, data }) => {
        if (errors) {
          console.log(errors)
          reject(errors)
        }

        // Create blog posts & pages.
        const items = data.allFile.edges
        // const posts = items.filter(({ node }) => /posts/.test(node.name))
        // each(posts, ({ node }) => {
        //   if (!node.remark) return
        //   if (node.remark.frontmatter.layout !== 'post') return
        //   const { path } = node.remark.frontmatter
        //   createPage({
        //     path,
        //     component: PostTemplate,
        //   })
        // })

        // const pages = items.filter(({ node }) => /page/.test(node.name))
        // each(pages, ({ node }) => {
        //   if (!node.remark) return
        //   const { name } = path.parse(node.path)
        //   const PageTemplate = path.resolve(node.path)
        //   createPage({
        //     path: name,
        //     component: PageTemplate,
        //   })
        // })

        const blocks = items.filter(({ node }) => /blocks/.test(node.name))
        each(blocks, ({ node }) => {
          if (!node.remark) return
          const { path } = node.remark.frontmatter
          createPage({
            path,
            component: BlockTemplate,
          })
        })

        const sites = data.allSitesJson.edges;
        each(sites, ({ node }) => {
          const { siteName, url } = node
          const path = `/sites/${siteName}`.toLowerCase()
          createPage({
            path,
            component: SiteTemplate,
          })
        })
      })
    )
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        templates: path.resolve(__dirname, 'src/templates'),
        scss: path.resolve(__dirname, 'src/scss'),
      },
    },
  })
}
