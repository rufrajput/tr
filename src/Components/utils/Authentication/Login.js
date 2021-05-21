import { Parse } from 'parse';

export const handleLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        Parse.User.logIn(username, password).then(
            (result) => {
                const currentUser = Parse.User.current();
                resolve(currentUser);
            },
            (error) => {
                reject(error)
            }
        );
    })
};