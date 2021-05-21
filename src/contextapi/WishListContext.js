import React, { createContext, useReducer, useEffect, useState } from 'react';
import WishListReducer from './WishListReducer';
import { addWishlistToDB } from '../Components/utils/Wishlist';
import { setWishlistToStorage, getWishlistFromStorage } from '../Components/utils/localStorage/LocalWishlist';


const initial_state = {
    wish: [],
};

export const wishContext = createContext(initial_state)

export const WishProvider = ({ children }) => {
    const [renderCount, setRenderCount] = useState(0);
    const [state, dispatch] = useReducer(WishListReducer, initial_state, () => {
        const localWishlist = getWishlistFromStorage();
        return localWishlist ? { wish: localWishlist } : { wish: [] }
    });

    useEffect(() => {
        setWishlistToStorage(state.wish);
        if (renderCount < 1) {
            setRenderCount(renderCount + 1);
        }
        if (renderCount > 0) {
            addWishlistToDB(state.wish);
        }
    }, [state.wish])

    const addToWish = (obj) => {
        dispatch({
            type: 'Add_To_wishList',
            payload: obj
        })
    }
    const removeToWish = (obj) => {
        dispatch({
            type: 'remove_To_wishList',
            payload: obj
        })
    }


    return (
        <wishContext.Provider value={{
            wish: state.wish,
            addToWish,
            removeToWish
        }}>
            {children}
        </wishContext.Provider>
    )
}
