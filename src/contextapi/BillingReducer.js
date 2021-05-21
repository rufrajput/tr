export default (state, action) => {
    switch (action.type) {

        case 'Set_BillingInfo':
            console.log('payload', action.payload)
            return { ...state,BillingInfo: action.payload }
        case 'Set_BillingType':
            console.log('shippingAddressType', action.payload)
            return { ...state,shippingAddressType: action.payload }
        default:
            return state
    }
}