import React, { useState } from 'react';
import BillingInfo from './BillingInfo';
import OrderReview from './OrderReview';
import {OrderProvider} from '../../contextapi/order_context';

const main = () => {
    return(
      <OrderProvider>
        <BillingInfo />
        <OrderReview />
      </OrderProvider>
    )
}
export default main;