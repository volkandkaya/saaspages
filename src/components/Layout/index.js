import React from 'react'
import emergence from 'emergence.js'

import Navi from 'components/Navi'
import Footer from 'components/Footer'
import { siteMetadata } from '../../../gatsby-config'

import 'modern-normalize/modern-normalize.css'
import 'prismjs/themes/prism.css'
import 'scss/gatstrap.scss'
import 'animate.css/animate.css'
import 'font-awesome/css/font-awesome.css'

const PHStyle = {
  width: "250px",
  height: "54px",
  position: 'fixed',
  bottom: 0,
  right: '10px'
}

class Layout extends React.Component {
  componentDidMount() {
    emergence.init()
  }

  componentDidUpdate() {
    emergence.init()
  }

  render() {
    const { children, hideFooter } = this.props
    return (
      <div>
        <Navi title={siteMetadata.title} {...this.props} />
        {children}
        {!hideFooter ? <Footer title={siteMetadata.title} author={siteMetadata.author} /> : null}
        <a
          href="https://www.producthunt.com/posts/saas-pages?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-saas-pages"
          target="_blank">
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=162527&theme=light"
            alt="SaaS Pages - 900+ Screenshots of the best SaaS landing pages | Product Hunt Embed"
            style={PHStyle}
            width={250}
            height={54} />
        </a>
      </div>
    )
  }
}

export default Layout
