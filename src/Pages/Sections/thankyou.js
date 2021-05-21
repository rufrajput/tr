import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Parse } from "parse";
import { OrderContext } from '../../contextapi/order_context';
import { CartContext } from '../../contextapi/context_cart';
import { isEmptyObject } from '../../Components/utils/EmptyObject';
const ThankYou = () => {
    const { billingData, shippingData } = useContext(OrderContext);
    const {refId, option} = useParams();
    const [currencySign, setCurrencySign] = useState();
    const { item, removeAllItems } = useContext(CartContext);
    const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);


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
            {console.log('ThankYou billingData: ', billingData)}
            {console.log('ThankYou shippingData: ', shippingData)}
            <section className="main-container col2-right-layout">
                <div className="main container">
                    <div className="row">
                        <div className="col-main">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="page-title">
                                        <h2>Thank you</h2>
                                    </div>
                                    <br />
                                    <div className="box-border">
                                        <ul className="shipping_method">
                                            <div className="media">
                                                <div className="media-left">
                                                    <i className="fa fa-check thankyou_tick" aria-hidden="true"></i>
                                                </div>
                                                <div className="media-body">
                                                    <p>Order #{refId}</p>
                                                    <h4 className="media-heading">Thank you {isEmptyObject(billingData) ?
                                                        shippingData.editFirstName
                                                        :
                                                        billingData.firstName} !</h4>
                                                </div>
                                            </div>
                                            <div className="ps-block__panel">
                                                <figure>
                                                    <h4 className="mb-0">Your order is confirmed </h4>
                                                </figure>
                                                <figure>
                                                    <p>You'll recive an email when your order is ready</p>
                                                </figure>
                                            </div>
                                            <div className="ps-block__panel">
                                                <figure>
                                                    <h4 className="mb-0">Order Updates </h4>
                                                </figure>
                                                <figure>
                                                    <p>You'll get shipping and delivery updates by email.</p>
                                                </figure>
                                            </div>
                                            <div className="ps-block__panel">
                                                <figure>
                                                    <h4 className="mb-0">Customer information </h4>
                                                </figure>
                                                <div className="row">
                                                    <figure>
                                                        <div className="col-sm-6">
                                                            <p className="font-weight-bold">Contact information</p>
                                                            {isEmptyObject(shippingData) ?
                                                                <p>{billingData.email}</p>
                                                                :
                                                                <p>{shippingData.editEmail}</p>
                                                            }
                                                            <br />
                                                            <p className="font-weight-bold">Shipping address</p>
                                                            {isEmptyObject(shippingData) ?
                                                                <>
                                                                    <p>{billingData.firstName} {billingData.lastName}</p>
                                                                    <p>{billingData.Address}</p>
                                                                    <p>{billingData.selectedCountry}</p>
                                                                    <p>{billingData.phone}</p>
                                                                </>
                                                                :
                                                                <>
                                                                    <p>{shippingData.editFirstName} {shippingData.editLastName}</p>
                                                                    <p>{shippingData.editAddress}</p>
                                                                    <p>{shippingData.selectedCountry}</p>
                                                                    <p>{shippingData.editPhone}</p>
                                                                </>}
                                                            <br />
                                                            <p className="font-weight-bold">Shipping method</p>
                                                            <p>Free shipping</p>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <p className="font-weight-bold">Payment method</p>
                                                            <p>{option === 'cod' ? `Cash on Delivery(COD)- ${currencySign}${subTotal}` : null}</p>
                                                            <br />
                                                            <p className="font-weight-bold">BIlling address</p>
                                                            {isEmptyObject(billingData) ?
                                                                <>
                                                                    <p>{shippingData.editFirstName} {shippingData.editLastName}</p>
                                                                    <p>{shippingData.editAddress}</p>
                                                                    <p>{shippingData.selectedCountry}</p>
                                                                    <p>{shippingData.editPhone}</p>
                                                                </>
                                                                :
                                                                <>
                                                                    <p>{billingData.firstName} {billingData.lastName}</p>
                                                                    <p>{billingData.Address}</p>
                                                                    <p>{billingData.selectedCountry}</p>
                                                                    <p>{billingData.phone}</p>
                                                                </>}
                                                        </div>

                                                    </figure>
                                                </div>
                                            </div>

                                        </ul>
                                        <div className="cart_navigation">
                                            <Link onClick={() => removeAllItems()} to="/">
                                                <button className="button pull-right" >
                                                    <i className="fa fa-angle-double-right"> </i>
                                                    <span>Continue Shopping</span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 ">
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
                                                    <span className="product_price">₱ {data.price * data.qty}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <hr />
                                        {/* <div className="row">
                                            <div className="col-md-8" >
                                                <input className="w-100" type="text" placeholder="Gift card or discount code" />
                                            </div>
                                            <div className="col-md-4">
                                                <button type="submit" className=" btn btn-default">Apply</button>
                                            </div>
                                        </div>
                                        <hr /> */}
                                        <div className="row form-group">
                                            <div className="col-md-12">
                                                <label for="" className="col-md-6 col-form-label">Subtotal:</label>
                                                <label for="" className="col-md-6 text-right col-form-label">
                                                    <strong> {currencySign} {subTotal} </strong>
                                                </label>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row form-group">
                                            <div className="col-md-12">
                                                <label for="" className="col-md-6 col-form-label">Total:</label>
                                                <label for="" className="col-md-6 text-right col-form-label">
                                                    <strong> {currencySign} {subTotal} </strong>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default ThankYou;