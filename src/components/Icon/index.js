import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import React from 'react'

import {
  faApple,
  faAws,
  faFacebook,
  faGithub,
  faHtml5,
  faJs,
  faNode,
  faPhp,
  faReact,
  faTwitter,
  faVuejs
} from '@fortawesome/free-brands-svg-icons'

//blocks
import {
  faBars,
  faPager,
  faHandsHelping,
  faFistRaised,
  faClipboardList,
  faListOl,
  faUsers,
  faDollarSign,
  faUserCheck,
  faWindowMinimize,
  faQuestion,
  faArrowAltCircleRight,
  faExpandArrowsAlt,
  faAngleLeft,
  faAngleRight

} from '@fortawesome/free-solid-svg-icons'

  // 'Navbars': 'bars',
  // 'Headers': 'pager',
  // 'Clients': 'hands-helping',
  // 'Call to action': 'fist-raised',
  // 'Features': 'clipboard-list',
  // 'Steps': 'list-ol',
  // 'Team': 'users',
  // 'Pricing': 'dollar-sign',
  // 'Faq': 'question',
  // 'Testimonials': 'user-check',
  // 'Footers': 'window-minimize'

import './style.scss'

library.add(
  faApple,
  faAws,
  faFacebook,
  faGithub,
  faHtml5,
  faJs,
  faNode,
  faPhp,
  faReact,
  faTwitter,
  faVuejs,
  //blocks
  faBars,
  faPager,
  faHandsHelping,
  faFistRaised,
  faClipboardList,
  faListOl,
  faUsers,
  faDollarSign,
  faUserCheck,
  faWindowMinimize,
  faQuestion,
  faArrowAltCircleRight,
  faExpandArrowsAlt,
  faAngleLeft,
  faAngleRight
)

const Icon = ({ prefix, name, className }) => (
  <div className={className ? className : 'icon'} title={name}>
    <FontAwesomeIcon icon={[prefix, name]} />
  </div>
)

export default Icon
