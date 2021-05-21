import React from 'react';
import { Link } from "react-router-dom";

const ErrorPage = () => {

  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <ul>
                <li className="home"> <Link title="Go to Home Page" to="/">Home</Link><span>&raquo;</span></li>
                <li><strong>404 Error </strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="error-page">
        <div className="container">
          <div className="error_pagenotfound"> <strong>4<span id="animate-arrow">0</span>4 </strong> <br />
            <b>Oops... Page Not Found!</b> <em>Sorry the Page Could not be Found here.</em>
            <p>Try using the button below to go to main page of the site</p>
            <br />
            <Link to="/" className="button-back"><i className="icon-arrow-left-circle icons"></i>&nbsp; Go to Back</Link> </div>

        </div>
      </div>



    </>
  )
}

export default ErrorPage;