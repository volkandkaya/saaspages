import { Link } from 'gatsby'
import React, { useEffect, useRef } from 'react'
import { Lightbox } from 'react-modal-image'
import Icon from 'components/Icon'

import './style.scss'
import { blockToDisplayBlockName } from '../../constants/blocks'

class ImageModal extends React.Component {
  componentDidMount = () => {
    window.addEventListener("keydown", this.keyDownListener)
  };

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this.keyDownListener);
  };

  keyDownListener = (e) => {
    const {ss, screenshots, filterName} = this.props;
    let index = null;
    screenshots.map((s, i) => {
      if (s.screenshotData[filterName] === ss.screenshotData[filterName]) {
        index = i;
      }
    })
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

  nextSS = (e, index) => {
    e.preventDefault();
    this.props.setSS(this.props.screenshots[index])
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

    return (
      <div>
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
