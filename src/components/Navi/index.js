import React from 'react'
import { Link } from 'gatsby'
import { blocksOrder } from '../../constants/blocks'

class Navi extends React.Component {
  render() {
    const { location, title } = this.props;
    const blocks = this.props.blocks.map(block => block.block.frontmatter);

    return (
      <nav className="navbar navbar-expand navbar-light flex-column flex-md-row pt-3 fixed-top bg-white zIndex999">
        <div className="container-fluid px-md-5">
          <Link className="text-center" to="/">
            <h1 className="navbar-brand mb-0 text-primary pr-3">{title}</h1>
          </Link>
          <div className="navbar-nav-scroll">
            <ul className="navbar-nav bd-navbar-nav flex-row">
              <li
                className={
                  location.pathname === '/' ? 'nav-item active pr-3' : 'nav-item pr-3'
                }
              >
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li
                className={
                  location.pathname === '/sites' ? 'nav-item active pr-3' : 'nav-item pr-3'
                }
              >
                <Link to="/sites" className="nav-link">
                  Sites
                </Link>
              </li>
              <li className="nav-item dropdown pr-3">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Blocks
                </a>
                <div className="dropdown-menu border-0" aria-labelledby="navbarDropdown">
                  {blocksOrder.map(block => {
                      block = blocks.filter(b => b.title === block)[0]
                      return <a key={`dropdown-${block.title}`} className="dropdown-item" href={block.path}>{block.title}</a>
                    })
                  }
                </div>
              </li>
              <li
                className={
                  location.pathname === '/about/'
                    ? 'nav-item active pr-3'
                    : 'nav-item pr-3'
                }
              >
                <Link to="/about/" className="nav-link">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-nav flex-row ml-md-auto d-none d-md-flex" />
        </div>
      </nav>
    )
  }
}

export default Navi
