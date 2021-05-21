import { getUniqueId } from '../RandomNumber';

export const setGuestId = () => {
    // const guestId = localStorage.getItem('guestId');
    // if (!guestId) {
    localStorage.setItem('guestId', getUniqueId());
    // }
}
export const getGuestIdFromStorage = () => {
    return localStorage.getItem('guestId');
}

export const setUserToStorage = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
}
export const getUserFromStorage = () => {
    return JSON.parse(localStorage.getItem('user'));
}
export const removeUserFromStorage = () => {
    localStorage.removeItem('user');
}