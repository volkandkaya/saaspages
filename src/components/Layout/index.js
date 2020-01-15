import React, { Fragment } from 'react'
import emergence from 'emergence.js'
import axios from 'axios'

import Navi from 'components/Navi'
import Footer from 'components/Footer'
import { siteMetadata } from '../../../gatsby-config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from 'components/Icon'

import 'modern-normalize/modern-normalize.css'
import 'prismjs/themes/prism.css'
import 'scss/gatstrap.scss'
import 'animate.css/animate.css'
import 'font-awesome/css/font-awesome.css'

const PHStyle = {
  width: '250px',
  height: '54px',
  position: 'fixed',
  bottom: 0,
  right: '10px',
}

const validateEmail = email => {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

const TickIcon = () => {
  return (
    <span className="text-primary pr-3">
      <Icon prefix="fas" name="check" className="d-inline-block" />
    </span>
  )
}

const Popup = ({
  emailAPI,
  handleEmailChange,
  isRequesting,
  isSent,
  error,
  email,
}) => {
  const emailValidClass = email
    ? validateEmail(email)
      ? 'is-valid'
      : 'is-invalid'
    : ''

  // const isPopupSent = window.localStorage.popup

  return (
    <div
      className="modal fade"
      id="exitModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog mx-auto"
        role="document"
        style={{ maxWidth: '650px', top: '10%' }}
      >
        <div className="modal-content">
          <div className="modal-body">
            <div className="container px-5 pb-3">
              <div className="row">
                <div className="col-12">
                  <button
                    className="float-right mr-n4 lead btn btn-lg bg-transparent"
                    onClick={() => $('#exitModal').modal('hide')}
                  >
                    <FontAwesomeIcon icon={['fas', 'times']} />
                  </button>
                </div>
                <div className="col-12 mb-4">
                  <h2
                    className="font-weight-bold text-dark text-center mb-5"
                    style={{ fontSize: '26px' }}
                  >
                    Join 442 SaaS enthusiasts getting weekly updates with the
                    latest landing pages.
                  </h2>
                  <div className="w-100">
                    <div className="mx-auto" style={{ width: '200px' }}>
                      <p className="font-weight-bold">
                        <TickIcon /> SaaS Landing Pages
                      </p>
                      <p className="font-weight-bold">
                        <TickIcon /> Actionable Tips
                      </p>
                      <p className="font-weight-bold">
                        <TickIcon /> &lt; 0.8% unsubscribe
                      </p>
                      <p className="font-weight-bold">
                        <TickIcon /> Free, forever
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <div className="w-100">
                    <div className="mx-auto" style={{ width: '300px' }}>
                      {!isSent ? (
                        <Fragment>
                          <input
                            className={
                              'w-300px form-control form-control-lg d-inline-block mb-3 ' +
                              emailValidClass
                            }
                            placeholder="example@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            type="email"
                            name="email"
                          />
                          <button
                            className="btn btn-primary btn-lg btn-block"
                            type="submit"
                            onClick={() => emailAPI(email)}
                            disabled={isRequesting}
                          >
                            Level up my landing pages
                          </button>
                          {!!error ? (
                            <p className="text-danger">{error}</p>
                          ) : null}
                        </Fragment>
                      ) : (
                        <h2 className="text-success text-center">
                          Thank you for subscribing!
                        </h2>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

class Layout extends React.Component {
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
        window.localStorage.popup = true
      })
      .catch(function(error) {
        console.log(error)
      })
    this.setState({ email: '', isSent: true, isRequesting: false })
  }

  handleEmailChange = e => {
    this.setState({ email: e.target.value })
  }

  componentDidMount() {
    emergence.init()
  }

  componentDidUpdate() {
    emergence.init()
  }

  handleExitPopup = e => {
    console.log(window.localStorage.popup)
    if (window.localStorage.popup === 'true') {
      return null
    }
    if (
      window.localStorage.popup &&
      Date.now() < window.localStorage.popup + 7 * 24 * 60 * 60 * 1000
    ) {
      return null
    } else if (e.clientY < 0) {
      $('#exitModal').modal('show')
      window.localStorage.popup = Date.now()
    }
  }
  // $('#myModal').modal('show')

  render() {
    const { children, hideFooter } = this.props
    return (
      <div
        className="test"
        onMouseLeave={this.handleExitPopup}
        onClick={this.handleExitPopup}
      >
        <Navi title={siteMetadata.title} {...this.props} />
        {children}
        {!hideFooter ? (
          <Footer title={siteMetadata.title} author={siteMetadata.author} />
        ) : null}
        <a
          href="https://www.producthunt.com/posts/saas-pages?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-saas-pages"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=162527&theme=light"
            alt="SaaS Pages - 900+ Screenshots of the best SaaS landing pages | Product Hunt Embed"
            style={PHStyle}
            width={250}
            height={54}
          />
        </a>
        <Popup
          emailAPI={this.emailAPI}
          handleEmailChange={this.handleEmailChange}
          {...this.state}
        />
      </div>
    )
  }
}

export default Layout
