import { getGuestIdFromStorage, getUserFromStorage } from './localStorage/LocalUser';
import { addUserPointer } from '../../Queries/User';
import { saveItemsToDB } from '../../Queries/StorageToDB';

let prevGuestId;

export const addWishlistToDB = async (wishlistItems) => {
    const guestid = getGuestIdFromStorage();
    const localUser = getUserFromStorage();

    const args = {
        className: 'Wishlist',
        columnName: 'wishlistItems',
        items: wishlistItems,
        guestid, localUser,
    }
    try {
        prevGuestId = await saveItemsToDB(args);
    }
    catch (err) {
        console.log(err);
    }

}

export const setWishlistUser = (userId, className, localStorageData) => {
    // call method to add pointer
    addUserPointer(userId, className, localStorageData, prevGuestId);
}