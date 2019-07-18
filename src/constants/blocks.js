export const blockToDisplayBlockName = {
  Navbars: "Navbar",
  Headers: "Hero",
  Clients: "Clients",
  CTA: "CTA",
  Features: "Features",
  Steps: "Steps",
  Team: "Team",
  Pricing: "Pricing",
  Faq: "FAQ",
  Testimonials: "Testimonials",
  Footers: "Footer",
}

export const displayToBlockName = (blockName) => {
  return Object.keys(blockToDisplayBlockName).filter(bn => blockToDisplayBlockName[bn] === blockName)[0]
}

export const blocksOrder = ['Navbar', 'Hero', 'Clients', 'CTA', 'Features', 'Team', 'Pricing', 'FAQ', 'Testimonials', 'Footer']

export const blockIcons = {
  'Navbars': 'bars',
  'Headers': 'pager',
  'Clients': 'hands-helping',
  'CTA': 'fist-raised',
  'Features': 'clipboard-list',
  'Steps': 'list-ol',
  'Team': 'users',
  'Pricing': 'dollar-sign',
  'Faq': 'question',
  'Testimonials': 'user-check',
  'Footers': 'window-minimize'
}
