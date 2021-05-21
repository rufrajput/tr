import { Parse } from "parse";

export const parseFbLogin = async () => {
    return new Promise((resolve, reject) => {
        try {
            Parse.FacebookUtils.logIn("public_profile,email").then(user => {
                window.FB.api('/me', { locale: 'en_US', fields: 'name, last_name, email' }, function (fbresponse) {
                    if (user.get('authData').facebook.access_token) {
                        const fullNameArr = fbresponse.name.split(' ');
                        const firstName = fullNameArr[0];
                        const lastName = fullNameArr[1];
                        user.set('username', firstName);
                        user.set('first_name', firstName);
                        user.set('last_name', lastName);
                        user.set('email', fbresponse.email);
                        user.set('userType', 'customer');
                        user.set('isAdmin', false);
                        user.set('address', { "__type": "Pointer", "className": "UserAddress", "objectId": undefined });
                        user.save().then((response) => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        });
                    }
                });
            });
        } catch (error) {
            reject(error);
        }
    })
}
