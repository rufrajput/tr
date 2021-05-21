import { CustomParseUser, getUserAttributes } from '../Components/utils/ObjectToParse';
import React, { createContext, useReducer, useEffect } from 'react';
import LoginReducer from './LoginReducer';
import { setCartUser } from '../Components/utils/Cart';
import { setComparelistUser } from '../Components/utils/Comparelist';
import { setWishlistUser } from '../Components/utils/Wishlist';
import { getComparelistFromStorage } from '../Components/utils/localStorage/LocalComparelist';
import { getCartFromStorage } from '../Components/utils/localStorage/LocalCart';
import { getWishlistFromStorage } from '../Components/utils/localStorage/LocalWishlist';
import { setGuestId, setUserToStorage, removeUserFromStorage } from '../Components/utils/localStorage/LocalUser';

const initial_state = {
    custmerName: '',
    custmerGuest: '',
};
export const LoginContext = createContext(initial_state)

export const LoginProvider = ({ children }) => {
    const [state, dispatch] = useReducer(LoginReducer, initial_state, () => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        // if user no guest
        if (localUser && localUser.username) {
            // get object with required properties
            const userAttributes = getUserAttributes(localUser);
            // pass object in constructor to get back object of Parse User class
            const customUser = new CustomParseUser(userAttributes);
            const parseUser = customUser.getParseObject()
            return { custmerName: parseUser }
        }
        // if user is guest
        else if (localUser) {
            return { custmerGuest: localUser }
        }
        else {
            return {};
        }
    });

    useEffect(() => {
        const localCart = getCartFromStorage();
        const localComparelist = getComparelistFromStorage();
        const localWishlist = getWishlistFromStorage();
        setGuestId();
        if (state.custmerName) {
            setUserToStorage(state.custmerName)
            setCartUser(state.custmerName.id, 'Cart', localCart);
            setComparelistUser(state.custmerName.id, 'Comparelist', localComparelist);
            setWishlistUser(state.custmerName.id, 'Wishlist', localWishlist);
        }
        else if (state.custmerGuest) {
            setUserToStorage(state.custmerGuest)
        }
        else {
            removeUserFromStorage();
        }

    }, [state])

    const addUserName = (obj) => {
        dispatch({
            type: 'Set_UserName',
            payload: obj
        })
    }
    const addUserGuest = (obj) => {
        dispatch({
            type: 'Set_Guest',
            payload: obj
        })
    }

    return (
        <LoginContext.Provider value={{
            custmerName: state.custmerName,
            custmerGuest: state.custmerGuest,
            addUserName, addUserGuest
        }}>
            {children}
        </LoginContext.Provider>
    )
}