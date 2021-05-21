export const setWishlistToStorage = (wishlistItems) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
}

export const getWishlistFromStorage = () => {
    console.log('wishlist before returning from storage', localStorage.getItem('wishlist'))
    return JSON.parse(localStorage.getItem('wishlist'));
}