import { Parse } from 'parse';

export class CustomParseUser extends Parse.User {
    constructor(attributes) {
        super(attributes);
    }
    getParseObject() {
        // returns parse object converted from given attributes
        return this;
    }
}

// creates attributes object to form User class object
export const getUserAttributes = (attributes) => {
    const userAttributes = {
        username: attributes.username,
        email: attributes.email,
        emailVerified: attributes.emailVerified,
        first_name: attributes.first_name,
        isAdmin: attributes.isAdmin,
        last_name: attributes.last_name,
        logo: attributes.logo,
        phone: attributes.phone,
        username: attributes.username,
        objectId: attributes.objectId,
        subAdminPermissions: attributes.subAdminPermissions,
        updatedAt: attributes.updatedAt,
        userType: attributes.userType,
    }
    return userAttributes;
}

Parse.Object.registerSubclass('_User', CustomParseUser);