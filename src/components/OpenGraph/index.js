import React from 'react'

const customStyles = {
  box: {
    border: `1px solid #CED9E0`,
    padding: '15px',
    width: '600px',
    backgroundColor: '#f2f3f5',
    fontFamily: 'Helvetica, Arial',
  },
  title: {
    color: '#000',
    fontSize: '18px',
    marginBottom: 0,
    fontWeight: 700
  },
  url: {
    color: '#5C7080',
    fontSize: '12px',
    marginBottom: 0,
    textTransform: 'uppercase'
  },
  description: {
    color: '#6a6a6a',
    fontSize: '13px',
  },
  image: {
    width: '250px'
  }
}

class OpenGraph extends React.Component {

  render() {
    const { image, title, description, url } = this.props

    return <div style={customStyles.box}>
      {image ? <img style={customStyles.image} src={image} alt='OpenGraph' /> : null}
      <p style={customStyles.url}>{url}</p>
      <p style={customStyles.title}>{title}</p>
      <p style={customStyles.description}>{description}</p>
    </div>
  }
}
export default OpenGraph
