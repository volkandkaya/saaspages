import { Link } from 'gatsby'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Lightbox } from 'react-modal-image'
import Icon from 'components/Icon'

import './style.scss'
import { blockToDisplayBlockName } from '../../constants/blocks'

class ImageModal extends React.Component {
  componentDidMount = () => {
    ReactDOM.findDOMNode(this.refs.theDiv).focus();
  };

  nextSS = (e, index) => {
    e.preventDefault();
    console.log(this.props.ss, index);
    this.props.setSS(this.props.screenshots[index])
  };

  onKeyDown = (e, index) => {
    if(e.keyCode === 37) {
      if (index !== 0) {
        this.nextSS(e, index - 1)
      }
    }
    if(e.keyCode === 39) {
      if (index !== this.props.screenshots.length - 1) {
        this.nextSS(e, index + 1)
      }
    }
  };

  render() {
    const {ss, onClose, screenshots, setSS, filterName} = this.props;
    const {siteName, date, blockName, imageName} = ss.screenshotData
    const ssURL = `/img/ss/${siteName}/${date}/${blockName}/${imageName}`
    const toURL = `/sites/${siteName.toLowerCase()}`
    const alt = (
        <span>{siteName} {blockToDisplayBlockName[blockName]} Block</span>
    );
    let index = null;
    screenshots.map((s, i) => {
      if (s.screenshotData[filterName] === ss.screenshotData[filterName]) {
        index = i;
      }
    })
    console.log(ss, index);

    return (
      <div tabIndex={0} ref="theDiv" onKeyDown={(e) => this.onKeyDown(e, index)} >
        {index !== 0 ? <div
          className='leftArrow'
          onClick={(e) => this.nextSS(e, index-1)}
        >
          <Icon className='arrowIcon text-primary' prefix='fas' name='angle-left'/>
        </div> : null}
        {index !== screenshots.length -1 ? <div
          className='rightArrow'
          onClick={(e) => this.nextSS(e, index+1)}
        >
          <Icon className='arrowIcon text-primary' prefix='fas' name='angle-right'/>
        </div> : null}
        <Lightbox
          large={`${ssURL}.png`}
          alt={alt}
          hideDownload
          onClose={onClose}
        />
      </div>
    );

  }
}

export default ImageModal
