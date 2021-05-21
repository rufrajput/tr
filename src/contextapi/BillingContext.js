import React, { createContext, useReducer } from 'react';
import BillingReducer from './BillingReducer';

const initial_state = {
    BillingInfo: {
        firstName: '',
        lastName: '', 
        zipcode: '', 
        city: '', 
        Address: '', 
        phone: '', 
        email: '', 
        shippingType: '', 
        country: '', 
        receviedType: ''
    },
    shippingAddressType:''
};
export const BillingContext = createContext(initial_state)

export const BillingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(BillingReducer, initial_state);

    const addBillingInfo = (obj) => {
        dispatch({
            type: 'Set_BillingInfo',
            payload: obj
        })
    }
    const addShippingType = (obj) => {
        dispatch({
            type: 'Set_BillingType',
            payload: obj
        })
    }
    return (
        <BillingContext.Provider value={{
            BillingInfo: state.BillingInfo,
            shippingAddressType: state.shippingAddressType,
            addBillingInfo,addShippingType
        }}>
            {children}
        </BillingContext.Provider>
    )
}