export default (state, action) => {
    switch (action.type) {
        case 'SET_ORDER_ID':
            return { order_id: action.payload }
        case 'SET_BILLING':
            console.log('SET_BILLING Payload: ', action.payload)
            return { ...state, billingData: action.payload }
        case 'SET_SHIPPING':
            console.log('SET_SHIPPING Payload: ', action.payload)
            return { ...state, shippingData: action.payload }
        default:
            return state
    }
}