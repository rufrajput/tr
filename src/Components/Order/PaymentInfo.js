import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Parse } from "parse";
import { CartContext } from '../../contextapi/context_cart';
import { OrderContext } from '../../contextapi/order_context';
import RoutingHistory from '../../RoutingHistory';
import { BillingContext } from '../../contextapi/BillingContext';


const PaymentInfo = () => {
    const { item } = useContext(CartContext);
    const { billingData, shippingData } = useContext(OrderContext);
    const [currencySign, setCurrencySign] = useState();
    const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);
    const [paymentdata, setPaymentData] = useState([]);
    const [selectedOption, setSelectesoption] = useState();
    const { shippingAddressType } = useContext(BillingContext)


    useEffect(() => {
        const Payment = Parse.Object.extend("PaymentInformation");
        const payment = new Parse.Query(Payment);
        payment.notEqualTo("mopType", null)
        payment.find().then(
            (result) => {
                setPaymentData(result);
            },
            (error) => {
                console.log("error");
            }
        );
        const Extras = Parse.Object.extend('Extras');
        const query = new Parse.Query(Extras);
        query.limit(1);
        query.find().then((results) => {
            setCurrencySign(results[0].get("priceSymbol"))
        }, (error) => {
            console.error('Error while fetching Extras', error);
        });
    }, []);

    const handleChange = (event) => {
        const paymentType = event.target.value.split(" ").join("-").toLowerCase();
        console.log('paymentType: ', paymentType);
        setSelectesoption(paymentType);
    }
    return (
        <>
        {subTotal !== 0 ?
            <section className="main-container col2-right-layout">
                {shippingAddressType === 'this address' ?
                    <div className="main container">
                        <div className="row">
                            <div className="col-main">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="page-title">
                                            <h2>Payment Information</h2>
                                        </div>
                                        <br />
                                        <div className="box-border">
                                            <div >
                                                <ul className="ps-tab-list no-bullets">
                                                    {paymentdata && paymentdata.map((data, index) => (
                                                        <li key={index}>
                                                            <label> <input type="radio" style={{ marginRight: '4px' }}
                                                                name="paymentOption"
                                                                value={data.get('mopType')}
                                                                className="mr-2"
                                                                required
                                                                onChange={handleChange}
                                                            />
                                                                {data.get('mopType')}</label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="cart_navigation"> <Link className="continue-btn" to="/shippingmethod"><i className="fa fa-arrow-left"> </i>&nbsp; Back </Link>
                                                <Link to={`/orderreview/${selectedOption}`}> <button className="button pull-right" ><i className="fa fa-angle-double-right"></i>&nbsp; <span>Continue</span></button></Link>  </div>
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
                                            <div className="row form-group">
                                                <div className="col-md-12">
                                                    <label for="" className="col-md-6 col-form-label">Subtotal:</label>
                                                    <label for="" className="col-md-6 text-right col-form-label">
                                                        <strong>  <p>  {currencySign} {subTotal} </p></strong>
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
                                                <h2>Payment Information</h2>
                                            </div>
                                            <br />
                                            <div className="box-border">
                                                <div >
                                                    <ul className="ps-tab-list no-bullets">
                                                        {paymentdata && paymentdata.map((data, index) => (
                                                            <li key={index}>
                                                                <label> <input type="radio" style={{ marginRight: '4px' }}
                                                                    name="paymentOption"
                                                                    value={data.get('mopType')}
                                                                    className="mr-2"
                                                                    required
                                                                    onChange={handleChange}
                                                                />
                                                                    {data.get('mopType')}</label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {/* <div className="ps-tabs">
                                                <div className="ps-tab active" id="visa">
                                                    <form className="ps-form--visa" action="index.html" method="get">
                                                        <div className="form-group">
                                                            <label>Card number</label>
                                                            <input className="form-control" type="text" placeholder=""/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Card Holders</label>
                                                            <input className="form-control" type="text" placeholder=""/>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <div className="form-group">
                                                                    <label>Experation Date</label>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <div className="form-group">
                                                                                <input className="form-control" type="text" placeholder="Month"/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <div className="form-group">
                                                                                <input className="form-control" type="text" placeholder="Year"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="form-group">
                                                                    <label>CVV</label>
                                                                    <input className="form-control" type="text" placeholder=""/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group submit">
                                                            <button className="ps-btn ps-btn--fullwidth">Submit</button>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="ps-tab" id="paypal"><a className="ps-btn" href="#">Proceed with Paypal</a></div>
                                            </div> */}
                                                </div>
                                                <div className="cart_navigation"> <Link className="continue-btn" to="/shippingmethod"><i className="fa fa-arrow-left"> </i>&nbsp; Back </Link>
                                                    <Link to={`/orderreview/${selectedOption}`}> <button className="button pull-right" ><i className="fa fa-angle-double-right"></i>&nbsp; <span>Continue</span></button></Link>  </div>
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
                                                <div className="row form-group">
                                                    <div className="col-md-12">
                                                        <label for="" className="col-md-6 col-form-label">Subtotal:</label>
                                                        <label for="" className="col-md-6 text-right col-form-label">
                                                            <strong>  <p>  {currencySign} {subTotal} </p></strong>
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

export default PaymentInfo;