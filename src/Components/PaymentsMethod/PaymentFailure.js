import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import paymaya from 'paymaya-js-sdk';
import { initPaymaya } from '../utils/Payment/Paymaya';
import { Parse } from 'parse';

const PaymentFailure = () => {

    const { orderId } = useParams();

    useEffect(() => {
        const Order = Parse.Object.extend('Order');
        const query = new Parse.Query(Order);
        query.get(orderId).then((object) => {
            object.set('paymentStatus', 'Pending');
            object.save().then((response) => {
            }, (error) => {
                console.error('Error while updating Order', error);
            });
        });
        initPaymaya();
    })

    const handleClick = async () => {
        const CheckoutObject = JSON.parse(localStorage.getItem('checkoutObject'));
        CheckoutObject.requestReferenceNumber = orderId + "1";
        console.log('CheckoutObject: ', CheckoutObject);
        try {
            await paymaya.createCheckout(CheckoutObject);
        }
        catch (err) {
            console.error('payment failed: ', err);
        }
    }

    return (
        <>
            <div className="col-75">
                <h1>Your Payment against {orderId} has failed. Please try again.</h1>
                <Link to="/">
                    Go to Home
                </Link>
                <button onClick={handleClick}>
                    Try Again
                </button>
            </div>
        </>
    )
}

export default PaymentFailure;