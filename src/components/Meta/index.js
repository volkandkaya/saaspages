import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'

const Meta = ({ site, title }) => {
  const siteTitle = get(site, 'title')
  title = title ? `${title} | ${siteTitle}` : siteTitle
  console.log(site);
  return (
    <Helmet
      title={title}
      meta={[
        { name: 'twitter:card', content: 'summary' },
        {
          name: 'twitter:image',
          content: `${get(site, 'url')}/img/saaspages.jpeg`,
        },
        { name: 'twitter:title', content: title },
        {
          name: 'twitter:description',
          content: get(site, 'description'),
        },
        {
          name: 'twitter:site',
          content: `@${get(site, 'twitter')}`,
        },
        { property: 'og:title', content: title },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:description',
          content: get(site, 'description'),
        },
        {
          property: 'og:url',
          content: `${get(site, 'url')}`,
        },
        {
          property: 'og:image',
          content: `${get(site, 'url')}/img/saaspages.jpeg`,
        },
      ]}
    />
  )
}
export default Meta
