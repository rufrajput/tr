import React, { createContext, useReducer, useEffect, useState } from 'react';
import reducer_cart from './reducer_cart';
import { addCartToDB } from '../Components/utils/Cart';
import { setCartToStorage, getCartFromStorage } from '../Components/utils/localStorage/LocalCart';

const initial_state = {
    item: [],
    userComment: '',
};

//context for pass the intial state 

export const CartContext = createContext(initial_state)

export const CartProvider = ({ children }) => {

    const [renderCount, setRenderCount] = useState(0);
    const [state, dispatch] = useReducer(reducer_cart, initial_state, () => {
        const localCartItems = getCartFromStorage();
        return localCartItems ? { item: localCartItems } : { item: [] };
    });

    useEffect(() => {
        setCartToStorage(state.item);
        if (renderCount < 1) {
            setRenderCount(renderCount + 1);
        }
        if (renderCount > 0) {
            addCartToDB(state.item);
        }
    }, [state.item])

    const addToCart = (items) => {
        dispatch({
            type: 'Add_To_Cart',
            payload: items
        })
    }
    const removeItem = (id) => {
        dispatch({
            type: 'Remove_Item',
            payload: id
        })
    }
    const removeAllItems = () => {
        dispatch({
            type: 'Remove_All',
        })
    }
    const incrementItem = (id) => {
        dispatch({
            type: 'Increment_Item',
            payload: id
        })
    }
    const decrementItem = (id) => {
        dispatch({
            type: 'Decrement_Item',
            payload: id
        })
    }
    const setUserComment = (text) => {
        dispatch({
            type: 'Set_Comment',
            payload: text
        })
    }

    return (
        <CartContext.Provider value={{
            item: state.item,
            userComment: state.userComment,
            addToCart, removeItem,
            incrementItem, decrementItem, removeAllItems, setUserComment
        }}>
            {children}
        </CartContext.Provider>
    )
}
