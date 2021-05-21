import { getGuestIdFromStorage, getUserFromStorage } from './localStorage/LocalUser';
import { addUserPointer } from '../../Queries/User';
import { saveItemsToDB } from '../../Queries/StorageToDB';

let prevGuestId;

export const addComparelistToDB = async (comparelistItems) => {

    const guestid = getGuestIdFromStorage();
    const localUser = getUserFromStorage();

    const args = {
        className: 'Comparelist',
        columnName: 'comparelistItems',
        items: comparelistItems,
        guestid, localUser,
    }
    try {
        prevGuestId = await saveItemsToDB(args);
    }
    catch (err) {
        console.log(err);
    }
}

export const setComparelistUser = (userId, className, localStorageData) => {
    // call method to add pointer
    addUserPointer(userId, className, localStorageData, prevGuestId);
}
