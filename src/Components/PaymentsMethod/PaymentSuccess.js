import React, { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Parse } from 'parse';

const PaymentSuccess = () => {
    const { orderId } = useParams();

    useEffect(() => {
        const Order = Parse.Object.extend('Order');
        const query = new Parse.Query(Order);
        query.get(orderId).then((object) => {
            object.set('paymentStatus', 'Paid');
            object.save().then((response) => {
            }, (error) => {
                console.error('Error while updating Order', error);
            });
        });
        localStorage.removeItem('checkoutObject');
    })
    return (
        <>
            <div className="col-75">
                <h1>Your Payment is successful. Thanks for placing order.</h1>
                <div>
                    <Link to="/">
                        Go to Home
                    </Link>
                </div>
            </div>
        </>
    )
}

export default PaymentSuccess;