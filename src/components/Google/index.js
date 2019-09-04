import React from 'react'

const customStyles = {
  box: {
    border: `1px solid #CED9E0`,
    borderRadius: '5px',
    padding: '15px',
    minWidth: '350px',
    maxWidth: '600px'
  },
  title: {
    color: '#1a0dab',
    fontSize: '18px',
    marginBottom: 0
  },
  url: {
    color: '#006621',
    fontSize: '14px',
    marginBottom: 0
  },
  description: {
    color: '#6a6a6a',
    fontSize: '13px',
  }
}

class Google extends React.Component {

  render() {
    const {title, description, url} = this.props

    return <div style={customStyles.box}>
      <p style={customStyles.title}>{title}</p>
      <p style={customStyles.url}>{url}</p>
      <p style={customStyles.description}>{description}</p>
    </div>
  }
}
export default Google
