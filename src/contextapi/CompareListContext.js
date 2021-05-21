import React, { createContext, useReducer, useEffect, useState } from 'react';
import CompareListReducer from './CompareListReducer';
import { addComparelistToDB } from '../Components/utils/Comparelist';
import { setComparelistToStorage, getComparelistFromStorage } from '../Components/utils/localStorage/LocalComparelist';


const initial_state = {
    compare: [],
};

export const compareContext = createContext(initial_state)

export const CompareProvider = ({ children }) => {
    const [renderCount, setRenderCount] = useState(0);
    const [state, dispatch] = useReducer(CompareListReducer, initial_state, () => {
        const localComparelist = getComparelistFromStorage();
        return localComparelist ? { compare: localComparelist } : { compare: [] }
    });

    useEffect(() => {
        // setGuestId();
        setComparelistToStorage(state.compare);
        if (renderCount < 1) {
            setRenderCount(renderCount + 1);
        }
        if (renderCount > 0) {
            addComparelistToDB(state.compare);
        }
    }, [state.compare])

    const addToCompare = (obj) => {
        dispatch({
            type: 'Add_To_CompareList',
            payload: obj
        })
    }
    const removeToCompare = (obj) => {
        dispatch({
            type: 'remove_To_CompareList',
            payload: obj
        })
    }


    return (
        <compareContext.Provider value={{
            compare: state.compare,
            addToCompare,
            removeToCompare
        }}>
            {children}
        </compareContext.Provider>
    )
}