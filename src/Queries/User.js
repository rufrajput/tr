import { Parse } from 'parse';

export const addUserPointer = (userId, className, localStorageData, prevGuestId) => {
    console.log('addUserPointer running');
    // const localComparelist = getComparelistFromStorage();
    console.log('localStorageData.length: ', localStorageData);
    // method executes if atleast one item is in comparelist
    if (localStorageData && localStorageData.length > 0) {
        console.log('prevGuest: ', prevGuestId)
        // console.log('localCompare.length: ', localComparelist.length);
        const Comparelist = Parse.Object.extend(className);
        const comparelist = new Parse.Object(Comparelist);
        const query = new Parse.Query(Comparelist);
        query.equalTo("guestId", prevGuestId);
        query.find().then((guests) => {
            console.log('guests : ', guests);
            // check if user pointer is not defined for current guestId
            if (guests.length > 0) {
                if (!(guests[0].get("user"))) {
                    console.log(' user pointer is not defined for current guestId')
                    guests[0].set("user", { "__type": "Pointer", "className": "_User", "objectId": userId });
                    guests[0].save().then((updatedComparelist) => {
                        console.log('Comparelist updated: ', updatedComparelist);
                    }, (error) => {
                        console.error('Comparelist update on login error: ', error);
                    })
                }
                // if user has logged in with different id and orders same items present in localstorage
                if (guests[0].get('user').id !== userId) {
                    console.log('userID of current record against guestId in db is not same as userId argument')
                    comparelist.set("user", { "__type": "Pointer", "className": "_User", "objectId": userId });
                    comparelist.save().then((updatedComparelist) => {
                        console.log('comparelist updated: ', updatedComparelist);
                    }, (error) => {
                        console.error('comparelist update on login error: ', error);
                    })
                }
            }
        }, (error) => {
            console.error('guestId for comparelist not exists in db: ', error);
        })
    }
}
