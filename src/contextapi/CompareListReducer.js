import { act } from "react-dom/test-utils"

export default (state, action) => {
    switch (action.type) {
        case 'Add_To_CompareList':
            // add to comparelist, dont add duplicate item
            let compareItem;
            const existingItem = state.compare.some(product => product.id === action.payload.id);
            if (!existingItem) {
                compareItem = action.payload
            }
            return {
                compare: compareItem ? [compareItem, ...state.compare] : [...state.compare]
            }

        case 'remove_To_CompareList':

            return {
                compare: state.compare.filter(i => i.id !== action.payload)
            }
        default:
            return state
    }
}