
export const setCartToStorage = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

export const getCartFromStorage = () => {
    return JSON.parse(localStorage.getItem('cart'));
}