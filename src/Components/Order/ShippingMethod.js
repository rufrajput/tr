import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contextapi/context_cart';
import { OrderContext } from '../../contextapi/order_context';
import { BillingContext } from '../../contextapi/BillingContext';
import { Parse } from "parse";
import RoutingHistory from '../../RoutingHistory';
import {LoginContext} from '../../contextapi/LoginContext';
const ShippingMethod = () => {
  const { item } = useContext(CartContext);
  const { billingData, shippingData } = useContext(OrderContext);
  const { shippingAddressType } = useContext(BillingContext)
  const [currencySign, setCurrencySign] = useState();
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);
  const { custmerName } = useContext(LoginContext);

  useEffect(() => {

    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });

  }, [])
  return (
    <>
    { subTotal !== 0 ?
      <section className="main-container col2-right-layout">
        {shippingAddressType === 'this address' ?
          <div className="main container">
            <div className="row">
              <div className="col-main">
                <div className="row">
                  <div className="col-md-7">
                    <div className="page-title">
                      <h2>Shipping Method</h2>
                    </div>
                    <br />
                    <div className="box-border">
                      <ul className="shipping_method">
                        <h3>Shipping Info</h3>
                        <div className="ps-block__panel">
                          <figure><h6>Contact</h6>
                            <p>{billingData.email}</p> <Link to="/billinginfo">Change</Link>
                          </figure>
                          <figure><h6>Ship to</h6>
                            <p>{billingData.Address}</p> <Link to="/billinginfo">Change</Link>
                          </figure>
                        </div>
                        <h3>Shipping Fee</h3>
                        <div className="ps-block__panel2">
                          {/* <label for="radio_button_3">
                      <input type="radio" checked name="radio_3" id="radio_button_3"/>
                      </label> */}
                          <figure><h6>Free Shipping</h6><strong> ₱ 0.00</strong></figure>
                        </div>

                      </ul>
                      <div className="cart_navigation">
                      {custmerName && custmerName.get('username') ?
                         <Link className="continue-btn" to="/shippinginfo"><i className="fa fa-arrow-left"> 
                         </i>&nbsp; Back to Shipping Info </Link>
                         :   <Link className="continue-btn" to="/billinginfo"><i className="fa fa-arrow-left"> 
                         </i>&nbsp; Back to Billing Info </Link>}
                        <Link to="paymentinfo"> <button className="button pull-right"><i className="fa fa-angle-double-right"></i>&nbsp; <span>Continue</span></button></Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 ">
                    <div className="page-title">
                      <h1>Order Summary</h1>
                    </div>
                    <br />
                    <div className="shipping_cart">
                      {item && item.map((data) => (
                        <div className="row product_detail">
                          <div className="col-md-3">
                            <div className="product_image">
                              <img src={data.img} alt="Product" />
                              <span className="badge badge-secondary">{data.qty}</span>
                            </div>
                          </div>
                          <div className="col-md-6 p-0">
                            <span className="product_description">{data.name}</span>
                          </div>
                          <div className="col-md-3">
                            <span className="product_price">{currencySign} {data.price * data.qty}</span>
                          </div>
                        </div>
                      ))}
                      <hr />
                      <div className="row">
                        <div className="col-md-8" >
                          <input type="text" placeholder="Gift card or discount code" />
                        </div>
                        <div className="col-md-4">
                          <button type="submit" className=" btn btn-default">Apply</button>
                        </div>
                      </div>
                      <hr />
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label for="" className="col-md-6 col-form-label">Subtotal:</label>
                          <label for="" className="col-md-6 text-right col-form-label">
                            <strong>  <p> {currencySign} {subTotal}</p> </strong>
                          </label>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label for="" className="col-md-6 col-form-label">Discount:</label>
                          <label for="" className="col-md-6 text-right col-form-label">
                            <p> ₱ 0 </p>
                          </label>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label for="" className="col-md-6 col-form-label">Shipping:</label>
                          <label for="" className="col-md-6 text-right col-form-label">
                            <p> ₱ 0 </p>
                          </label>
                        </div>
                      </div>
                      <hr className="mt-0" />
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label for="" className="col-md-6 col-form-label">Total:</label>
                          <label for="" className="col-md-6 text-right col-form-label">
                            <strong>{currencySign} {subTotal}</strong>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> :
          (Object.keys(shippingData).length === 0 && shippingData.constructor === Object) ? RoutingHistory.push('/') :
            <div className="main container">
              <div className="row">
                <div className="col-main">
                  <div className="row">
                    <div className="col-md-7">
                      <div className="page-title">
                        <h2>Shipping Method</h2>
                      </div>
                      <br />
                      <div className="box-border">
                        <ul className="shipping_method">
                          <h3>Shipping Info</h3>
                          <div className="ps-block__panel">
                            <figure><h6>Contact</h6>
                              <p>{shippingData.email}</p><Link to="/shippinginfo">Change</Link>
                            </figure>
                            <figure><h6>Ship to</h6>
                              <p>{shippingData.Address}</p><Link to="/shippinginfo">Change</Link>
                            </figure>
                          </div>
                          <h3>Shipping Fee</h3>
                          <div className="ps-block__panel2">
                            {/* <label for="radio_button_3">
                      <input type="radio" checked name="radio_3" id="radio_button_3"/>
                      </label> */}
                            <figure><h6>Free Shipping</h6><strong> ₱ 0.00</strong></figure>
                          </div>

                        </ul>
                        <div className="cart_navigation"> 
                        <Link className="continue-btn" to="/shippinginfo"><i className="fa fa-arrow-left"> 
                        </i>&nbsp; Back to Shipping Info </Link>
                          <Link to="paymentinfo"> <button className="button pull-right"><i className="fa fa-angle-double-right"></i>&nbsp; <span>Continue</span></button></Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 ">
                      <div className="page-title">
                        <h1>Order Summary</h1>
                      </div>
                      <br />
                      <div className="shipping_cart">
                        {item && item.map((data) => (
                          <div className="row product_detail">
                            <div className="col-md-3">
                              <div className="product_image">
                                <img src={data.img} alt="Product" />
                                <span className="badge badge-secondary">{data.qty}</span>
                              </div>
                            </div>
                            <div className="col-md-6 p-0">
                              <span className="product_description">{data.name}</span>
                            </div>
                            <div className="col-md-3">
                              <span className="product_price">{currencySign} {data.price * data.qty}</span>
                            </div>
                          </div>
                        ))}
                        <hr />
                        <div className="row">
                          <div className="col-md-8" >
                            <input type="text" placeholder="Gift card or discount code" />
                          </div>
                          <div className="col-md-4">
                            <button type="submit" className=" btn btn-default">Apply</button>
                          </div>
                        </div>
                        <hr />
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label for="" className="col-md-6 col-form-label">Subtotal:</label>
                            <label for="" className="col-md-6 text-right col-form-label">
                              <strong>  <p> {currencySign} {subTotal}</p> </strong>
                            </label>
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label for="" className="col-md-6 col-form-label">Discount:</label>
                            <label for="" className="col-md-6 text-right col-form-label">
                              <p> ₱ 0</p>
                            </label>
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label for="" className="col-md-6 col-form-label">Shipping:</label>
                            <label for="" className="col-md-6 text-right col-form-label">
                              <p> ₱ 0</p>
                            </label>
                          </div>
                        </div>
                        <hr className="mt-0" />
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label for="" className="col-md-6 col-form-label">Total:</label>
                            <label for="" className="col-md-6 text-right col-form-label">
                              <strong>{currencySign} {subTotal}</strong>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
      </section>
      : RoutingHistory.push('/')}
    </>
  )
}

export default ShippingMethod;