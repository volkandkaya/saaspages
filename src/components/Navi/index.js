import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import axios from 'axios'
import { blocksOrder } from '../../constants/blocks'

const validateEmail = email => {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

class Navi extends React.Component {
  state = {
    email: '',
    isRequesting: false,
    isSent: false,
    error: '',
  }

  emailAPI = email => {
    let isSent = false
    if (!validateEmail(email)) {
      this.setState({ error: 'Invalid Email' })
      return false
    }
    this.setState({ isRequesting: true })

    axios
      .post('https://sheetdb.io/api/v1/w59qljkoc4npo', {
        data: [{ email }],
      })
      .then(function(response) {
        window.localStorage.popup
      })
      .catch(function(error) {
        console.log(error)
      })
    this.setState({ email: '', isSent: true, isRequesting: false })
  }

  render() {
    const { email, isRequesting, isSent, error } = this.state
    const { location, title } = this.props
    const blocks = this.props.blocks.map(block => block.block.frontmatter)

    const emailValidClass = email
      ? validateEmail(email)
        ? 'is-valid'
        : 'is-invalid'
      : ''

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light pt-3 fixed-top bg-white zIndex999">
        <Link className="text-center pl-md-5" to="/">
          <h1 className="navbar-brand mb-0 text-primary pr-3">{title}</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li
              className={
                location.pathname === '/'
                  ? 'nav-item active pr-3'
                  : 'nav-item pr-3'
              }
            >
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li
              className={
                location.pathname === '/sites'
                  ? 'nav-item active pr-3'
                  : 'nav-item pr-3'
              }
            >
              <Link to="/sites" className="nav-link">
                Sites
              </Link>
            </li>
            <li className="nav-item dropdown pr-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Blocks
              </a>
              <div
                className="dropdown-menu border-0"
                aria-labelledby="navbarDropdown"
              >
                {blocksOrder.map(block => {
                  block = blocks.filter(b => b.title === block)[0]
                  return (
                    <a
                      key={`dropdown-${block.title}`}
                      className="dropdown-item"
                      href={block.path}
                    >
                      {block.title}
                    </a>
                  )
                })}
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
          <div className="form-inline mr-md-3">
            {!isSent ? (
              <Fragment>
                <input
                  className={
                    'w-300px form-control d-inline-block mr-2 ' +
                    emailValidClass
                  }
                  placeholder="Your email address"
                  value={email}
                  onChange={e => this.setState({ email: e.target.value })}
                  required
                  type="email"
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={() => this.emailAPI(email)}
                  disabled={isRequesting}
                >
                  Stay Updated
                </button>
                {!!error ? <p className="text-danger">{error}</p> : null}
              </Fragment>
            ) : (
              <h5>Thank you for subscribing!</h5>
            )}
          </div>
        </div>
      </nav>
    )
  }
}

export default Navi
