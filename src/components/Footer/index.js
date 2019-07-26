import { Link } from 'gatsby'
import React, { Fragment, useState } from 'react'
import axios from 'axios';
import './style.scss'

const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

const Footer = ({ author, title }) => {
  const [email, setEmail] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const emailAPI = (email) => {
    if (!validateEmail(email)) {
      setError('Invalid Email')
      return false;
    }
    setIsRequesting(true)
    axios.post('https://sheetdb.io/api/v1/w59qljkoc4npo', {
      data: [{email}]
    })
    .then(function (response) {
      setEmail('')
      setIsRequesting(false)
      setIsSent(true)
    })
    .catch(function (error) {
      setIsRequesting(false)
    });
  }
  const emailValidClass = email ? validateEmail(email) ? 'is-valid' : 'is-invalid' : '';
  return (
    <div className="footer">
      <div
        className="w-500px container text-center my-5 py-5"
        style={{maxWidth: "500px"}}
      >
        <h2 className="display-md-4 font-weight-bolder">Want to keep updated?</h2>
        <p>We will only send you the latest landing pages and the most relevant articles. Never spam.</p>
        {!isSent ? <Fragment>
          <input
            className={"w-300px form-control d-inline-block mr-2 " + emailValidClass}
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
          />
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => emailAPI(email)}
            disabled={isRequesting}>Get Updates</button>
            {!!error ? <p className="text-danger">{error}</p> : null}
          </Fragment> : <h5>Thank you for subscribing!</h5> }
      </div>
      <div class="container-fluid text-center py-5 bg-primary text-white">
        <h2 class="display-md-4 font-weight-bolder pb-3">Need to build a SaaS landing page?</h2>
        <a class="btn btn-light btn-lg font-weight-bold text-primary" href="https://versoly.com" target="_blank">Try Versoly</a>
      </div>
      <div className="container-fluid text-center py-5 bg-light-blue">
        <p>
          Saas Pages features the best landing pages to get inspiration for copywriting and design.
        </p>
        <p>Created by <a href="https://twitter.com/volkandkaya">Volkan Kaya</a> @ <a href="https://twitter.com/versoly">Versoly</a></p>
      </div>
    </div>
  );
}

export default Footer
