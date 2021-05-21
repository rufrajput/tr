import React, { createContext, useReducer } from 'react';
import order_reducer from './order_reducer';


const initial_state = {
    order_id: '',
    billingData: {},
    shippingData: {},
};

export const OrderContext = createContext(initial_state)

export const OrderProvider = ({ children }) => {
    const [state, dispatch] = useReducer(order_reducer, initial_state);

    const setOrderId = (obj_id) => {
        dispatch({
            type: 'SET_ORDER_ID',
            payload: obj_id
        })
    }
    const setBilling = (billingObj) => {
        dispatch({
            type: 'SET_BILLING',
            payload: billingObj
        })
    }
    const setShipping = (shippingObj) => {
        dispatch({
            type: 'SET_SHIPPING',
            payload: shippingObj
        })
    }


    return (
        <OrderContext.Provider value={{
            order_id: state.order_id,
            billingData: state.billingData,
            shippingData: state.shippingData,
            setOrderId, setBilling, setShipping
        }}>
            {children}
        </OrderContext.Provider>
    )
}
