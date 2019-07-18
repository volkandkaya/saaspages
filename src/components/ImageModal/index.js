import { Link } from 'gatsby'
import React from 'react'
import { Lightbox } from 'react-modal-image'
import { blockToDisplayBlockName } from '../../constants/blocks'

const ImageModal = ({ss, onClose}) => {
  const {siteName, date, blockName, imageName} = ss.screenshotData
  const ssURL = `/img/ss/${siteName}/${date}/${blockName}/${imageName}`
  const toURL = `/sites/${siteName.toLowerCase()}`
  const alt = (
      <span>{siteName} {blockToDisplayBlockName[blockName]} Block</span>
  );

  return <Lightbox
    large={`${ssURL}.png`}
    alt={alt}
    hideDownload
    onClose={onClose}
  />;
}

export default ImageModal
