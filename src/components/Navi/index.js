import React from 'react'
import { Link } from 'gatsby'
import { blocksOrder } from '../../constants/blocks'

class Navi extends React.Component {
  render() {
    const { location, title } = this.props;
    const blocks = this.props.blocks.map(block => block.block.frontmatter);

    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light pt-3 fixed-top bg-white zIndex999">
        <Link className="text-center pl-md-5" to="/">
          <h1 className="navbar-brand mb-0 text-primary pr-3">{title}</h1>
        </Link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
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
              <li
                className={
                  location.pathname === '/roadmap/'
                    ? 'nav-item active pr-3'
                    : 'nav-item pr-3'
                }
              >
                <Link to="/roadmap/" className="nav-link">
                  Roadmap
                </Link>
              </li>
            </ul>
        </div>
      </nav>
    )

    return (
      <nav className="navbar navbar-expand navbar-light pt-3 fixed-top bg-white zIndex999">
          <Link className="text-center px-md-5" to="/">
            <h1 className="navbar-brand mb-0 text-primary pr-3">{title}</h1>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse navbar-nav-scroll">
            <ul className="navbar-nav flex-row">
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
      </nav>
    )
  }
}

export default Navi
