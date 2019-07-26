import { Link } from 'gatsby'
import React from 'react'
import { Lightbox } from 'react-modal-image'
import Icon from 'components/Icon'

import './style.scss'
import { blockToDisplayBlockName } from '../../constants/blocks'


const ImageModal = ({ss, onClose, screenshots, setSS, filterName}) => {
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

  const nextSS = (e, index) => {
    e.preventDefault();
    setSS(screenshots[index])
  }

  const onKeyDown = (e) => {
    if(e.keyCode === 37) {
      nextSS(e, index - 1)
    }
    if(e.keyCode === 39) {
      nextSS(e, index + 1)
    }
  }

  return (
    <div onKeyDown={onKeyDown}>
      {index !== 0 ? <button
        className='leftArrow btn btn-light'
        onClick={(e) => nextSS(e, index-1)}
      >
        <Icon className='arrowIcon text-primary' prefix='fas' name='angle-left'/>
      </button> : null}
      {index !== screenshots.length -1 ? <button
        className='rightArrow btn btn-light'
        onClick={(e) => nextSS(e, index+1)}
      >
        <Icon className='arrowIcon text-primary' prefix='fas' name='angle-right'/>
      </button> : null}
      <Lightbox
        large={`${ssURL}.png`}
        alt={alt}
        hideDownload
        onClose={onClose}
      />
    </div>
  );

}

export default ImageModal
