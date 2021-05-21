import { Parse } from 'parse';

export const saveItemsToDB = (args) => {
    return new Promise((resolve, reject) => {
        console.log('args: ', args)
        const dbClassName = args.className;
        const DBClass = Parse.Object.extend(dbClassName);
        const dbObject = new DBClass();
        const query = new Parse.Query(DBClass);
        query.equalTo("guestId", args.guestid);
        query.find().then((guests) => {
            // if user not exists, save new record
            if (guests.length === 0) {
                if (args.guestid) {
                    dbObject.set(args.columnName, args.items);
                    dbObject.set('guestId', args.guestid);
                    // if user has logged in before adding items to cart, then set pointer
                    if (args.localUser && args.localUser.username) {
                        dbObject.set("user", { "__type": "Pointer", "className": "_User", "objectId": args.localUser.objectId });
                    }
                    dbObject.save().then(
                        (result) => {
                            console.log('new db record created', result);
                            resolve(result.get('guestId'));
                        },
                        (error) => {
                            console.error('Error while creating db record from localstorage: ', error);
                            reject('Error while creating db record from localstorage: ', error);
                        }
                    );
                }
            }
            else {
                // if user exists, update comparelist
                if (guests.length === 1) {
                    query.get(guests[0].id).then((existingGuest) => {
                        if (args.localUser && args.localUser.username) {
                            // if it is different user on same guestID
                            if (args.localUser.objectId !== guests[0].get('user').id) {
                                dbObject.set(args.columnName, args.items);
                                dbObject.set('guestId', args.guestid);
                                dbObject.set("user", { "__type": "Pointer", "className": "_User", "objectId": args.localUser.objectId });
                                dbObject.save().then((response) => {
                                    resolve(response.get('guestId'));
                                }, (err) => {
                                    console.error('Error while creating new record with new user on existing guestId: ', err);
                                    reject('Error while creating new record with new user on existing guestId: ', err);
                                })
                            }
                            else {
                                existingGuest.set(args.columnName, args.items);
                                existingGuest.save().then((response) => {
                                    resolve(response.get('guestId'));
                                }, (err) => {
                                    console.error('Error while creating new record with new user on existing guestId: ', err);
                                    reject('Error while creating new record with new user on existing guestId: ', err)
                                })
                            }
                        }
                        existingGuest.set(args.columnName, args.items);
                        existingGuest.set('guestId', args.guestid);
                        existingGuest.save().then((response) => {
                            console.log('db record updated: ', response);
                            resolve(response.get('guestId'))
                        }, (err) => {
                            console.error('Error while updating localstorage items data in db', err);
                            reject('Error while updating localstorage items data in db', err)
                        })
                    })
                }
            }
        }, (error) => {
            console.error('Error while fetching items from db', error);
            reject('Error while fetching items from db', error)
        })
    })
}