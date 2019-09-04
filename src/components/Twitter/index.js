import React from 'react'

const customStyles = {
  box: {
    border: `1px solid #CED9E0`,
    padding: '15px',
    width: '600px',
    fontFamily: 'Helvetica, Arial',
    borderRadius: '10px'
  },
  title: {
    color: '#000',
    fontSize: '15px',
    marginBottom: 0,
    fontWeight: 700
  },
  url: {
    color: '#5C7080',
    fontSize: '15px',
    marginBottom: 0
  },
  description: {
    color: '#6a6a6a',
    fontSize: '15px',
  }
}

class Twitter extends React.Component {

  render() {
    const { image, title, description, url } = this.props

    return <div style={customStyles.box}>
      {image ? <img className="w-250px" src={image} alt='twitter' /> : null}
      <p style={customStyles.title}>{title}</p>
      <p style={customStyles.description}>{description}</p>
      <p style={customStyles.url}>{url}</p>
    </div>
  }
}
export default Twitter
