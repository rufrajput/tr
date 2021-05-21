
export default (state, action) => {
    switch (action.type) {
        case 'Add_To_Cart':
            let updatedObj = {}

            const existingItem = state.item.find(product => {
                if (product.id === action.payload.id) {
                    return true
                }
                return false
            })
            const existingItemIndex = state.item.findIndex(product => {
                if (product.id === action.payload.id) {
                    updatedObj = {
                        ...action.payload,
                        qty: product.qty + 1
                    }
                    return true
                }
                return false
            })
            if (existingItem) {
                state.item[existingItemIndex] = updatedObj;
                return {
                    item: [...state.item]
                }
            }
            else {
                let newItem;
                action.payload.hasOwnProperty('qty') ? newItem = {...action.payload} : newItem = {...action.payload,qty: 1 }

                return {
                    item: [newItem, ...state.item]
                }
            }

        case 'Remove_Item':
            return {
                item: state.item.filter(i => i.id !== action.payload)
            }
        case 'Increment_Item':
            return {
                item: state.item.map(product => {
                    if (product.id === action.payload) {
                        const newQtyInc = product.qty + 1;
                        product.qty = newQtyInc;
                    }
                    return product;
                }),
            }
        case 'Decrement_Item':
            return {
                item: state.item.map(product => {
                    if (product.id === action.payload && product.qty > 1) {
                        const newQtyInc = product.qty - 1;
                        product.qty = newQtyInc;
                    }
                    return product;
                }),
            }
        case 'Remove_All':
            return {
                item: []
            }
        case 'Set_Comment':
            return { ...state, userComment: action.payload }
        default:
            return state
    }
}