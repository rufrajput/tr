export default (state, action) => {
    switch (action.type) {
        case 'Add_To_wishList':
            // add to wishlist, dont add duplicate item
            let wishListItem;
            const existingItem = state.wish.some(product => product.id === action.payload.id);
            if (!existingItem) {
                wishListItem = action.payload
            }
            return {
                wish: wishListItem ? [wishListItem, ...state.wish] : [...state.wish]
            }

        case 'remove_To_wishList':

            return {
                wish: state.wish.filter(i => i.id !== action.payload)
            }
        default:
            return state
    }
}