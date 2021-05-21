import { addUserPointer } from '../../Queries/User';
import { saveItemsToDB } from '../../Queries/StorageToDB';
import { getUserFromStorage, getGuestIdFromStorage } from './localStorage/LocalUser';

let prevGuestId;

export const addCartToDB = async (cartItems) => {
    const guestid = getGuestIdFromStorage();
    const localUser = getUserFromStorage();

    const args = {
        className: 'Cart',
        columnName: 'items',
        items: cartItems,
        guestid, localUser,
    }
    try {
        prevGuestId = await saveItemsToDB(args);
    }
    catch (err) {
        console.log(err);
    }

}

export const setCartUser = (userId, className, localStorageData) => {
    addUserPointer(userId, className, localStorageData, prevGuestId)
}