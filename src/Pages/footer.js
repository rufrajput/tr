import React, { useContext } from 'react';
import NewsLetter from '../Pages/Sections/newsletter';
import { Link } from 'react-router-dom';
import { LoginContext } from '../contextapi/LoginContext';
import {CartContext} from '../contextapi/context_cart';
import { notification } from 'antd';

const Footer = () => {

  const { custmerName } = useContext(LoginContext);
  const { item } = useContext(CartContext);
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);
  const accountRoute = custmerName ? '/dashboard' : '/account';
  const myOrdersRoute = custmerName ? '/orderlist' : '/my_orders';


  const Toste = () => {
    notification.error({
      message: 'You do not have any product in your cart.'
    });
  }

  return (
    <>
      <NewsLetter />
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xs-12">
              <div className="footer-logo">
                <Link to="/">
                  <img alt="Technowise360" title="Technowise360" src="https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/fbf9c5e84ff2d76b426b93935a68a4b4_logo.png" />
                </Link>
              </div>
              <p>
                Lorem Ipsum is simply dummy text of the print and
                typesetting industry. Ut pharetra augue nec augue. Nam elit
                agna, endrerit sit amet.
                  </p>
              <div className="social">
                <ul className="inline-mode">
                  <li className="social-network fb">
                    <Link
                      title="Connect us on Facebook"
                      target="_blank"
                      to="https://www.facebook.com"
                    >
                      <i className="fa fa-facebook"></i>
                    </Link>
                  </li>
                  <li className="social-network googleplus">
                    <Link
                      title="Connect us on Google+"
                      target="_blank"
                      to="https://plus.google.com"
                    >
                      <i className="fa fa-google"></i>
                    </Link>
                  </li>
                  <li className="social-network tw">
                    <Link
                      title="Connect us on Twitter"
                      target="_blank"
                      to="https://twitter.com/"
                    >
                      <i className="fa fa-twitter"></i>
                    </Link>
                  </li>
                  <li className="social-network linkedin">
                    <Link
                      title="Connect us on Pinterest"
                      target="_blank"
                      to="https://www.pinterest.com/"
                    >
                      <i className="fa fa-pinterest"></i>
                    </Link>
                  </li>
                  <li className="social-network rss">
                    <Link
                      title="Connect us on Instagram"
                      target="_blank"
                      to="https://instagram.com/"
                    >
                      <i className="fa fa-instagram"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-md-2 col-xs-12 collapsed-block">
              <div className="footer-links">
                <h3 className="links-title">
                  Information
                      <Link className="expander visible-xs" to="#TabBlock-1">
                    +
                      </Link>
                </h3>
                <div className="tabBlock" id="TabBlock-1">
                  <ul className="list-links list-unstyled">
                    <li>
                      <Link to="/delivery_information">Delivery Information</Link>
                    </li>
                    <li>
                      <Link to="/discount">Discount</Link>
                    </li>
                    {/* <li>
                      <Link to="sitemap.html">Sitemap</Link>
                    </li> */}
                    <li>
                      <Link to="/privacy_policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/faqs">FAQs</Link>
                    </li>
                    <li>
                      <Link to="/terms_and_condition">Terms &amp; Condition</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-3 col-md-2 col-xs-12 collapsed-block">
              <div className="footer-links">
                <h3 className="links-title">
                  Insider
                      <Link className="expander visible-xs" to="#TabBlock-3">
                    +
                      </Link>
                </h3>
                <div className="tabBlock" id="TabBlock-3">
                  <ul className="list-links list-unstyled">
                    <li>
                      <Link to="/news">News</Link>
                    </li>
                    <li>
                      <Link to="/trends">Trends</Link>
                    </li>
                    <li>
                      <Link to="/aboutus">About Us</Link>
                    </li>
                    <li>
                      <Link to="/contact_us">Contact Us</Link>
                    </li>
                    <li>
                      <Link to={myOrdersRoute}>My Orders</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-3 col-md-2 col-xs-12 collapsed-block">
              <div className="footer-links">
                <h3 className="links-title">
                  Service
                      <Link className="expander visible-xs" to="#TabBlock-4">
                    +
                      </Link>
                </h3>
                <div className="tabBlock" id="TabBlock-4">
                  <ul className="list-links list-unstyled">
                    <li>
                      <Link to={accountRoute}>Account</Link>
                    </li>
                    <li>
                      <Link to="/wishlist">Wishlist</Link>
                    </li>
                    {subTotal !== 0 ?
                    <li>
                      <Link to="/viewcart">Shopping Cart</Link>
                    </li>
                    : 
                    <li onClick={() => Toste()}>
                      <Link>Shopping Cart</Link>
                    </li>
}
                    <li>
                      <Link to="/return_policy">Return Policy</Link>
                    </li>
                    {/* <li>
                      <Link to="#">Special</Link>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3 col-xs-12 collapsed-block">
              <div className="footer-links">
                <h3 className="links-title">
                  Working hours
                      <Link className="expander visible-xs" to="#TabBlock-5">
                    +
                      </Link>
                </h3>
                <div className="tabBlock" id="TabBlock-5">
                  <div className="footer-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod.
                      </div>
                  <div className="footer-description">
                    <b>Monday-Friday:</b> 8.30 a.m. - 5.30 p.m.
                        <br />
                    <b>Saturday:</b> 9.00 a.m. - 2.00 p.m.
                        <br />
                    <b>Sunday:</b> Closed
                      </div>
                  <div className="payment">
                    <ul>
                      <li>
                        <Link to="#">
                          <img
                            title="Visa"
                            alt="Visa"
                            src="images/visa.png"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <img
                            title="Paypal"
                            alt="Paypal"
                            src="images/paypal.png"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <img
                            title="Discover"
                            alt="Discover"
                            src="images/discover.png"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <img
                            title="Master Card"
                            alt="Master Card"
                            src="images/master-card.png"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-coppyright">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-xs-12 coppyright">
                Copyright © 2021 <Link to="#"> Technowise360 </Link>. All Rights
                    Reserved.
                  </div>
              <div className="col-sm-6 col-xs-12">
                <ul className="footer-company-links">
                  <li>
                    <Link to="/aboutus">About Technowise360</Link>
                  </li>
                  <li>
                    <Link to="#">Careers</Link>
                  </li>
                  <li>
                    <Link to="#">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}


export default Footer;