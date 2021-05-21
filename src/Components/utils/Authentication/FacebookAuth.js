import { Parse } from "parse";

export const facebookLoginResponse = (response) => {
    return new Promise((resolve, reject) => {
        if (response.accessToken) {
            const User = new Parse.User();
            const query = new Parse.Query(User);
            query.equalTo("email", response.email);
            query.find().then(
                (user) => {
                    if (user.length === 1) {
                        const dummyPassword = "tayyab123456";
                        Parse.User.logIn(response.name, dummyPassword).then(
                            (result) => {
                                const currentUser = Parse.User.current();
                                resolve(currentUser)
                            },
                            (error) => {
                                reject('Login Failed', error);
                            }
                        );
                    }
                    else {
                        reject(new Error("No user found"))
                    }
                },
                (error) => {
                    reject("Error while fetching Facebook user", error);
                }
            );
        }
    })
}
export const facebookSignupResponse = (response) => {
    return new Promise((resolve, reject) => {
        if (response.accessToken) {
            const User = new Parse.User();
            const query = new Parse.Query(User);
            query.equalTo("email", response.email);
            query.find().then(user => {
                console.log("User found", user.length);
                if (user.length === 0) {
                    const dummyPassword = "tayyab123456";
                    const UserRegister = Parse.Object.extend("User");
                    const register = new UserRegister();
                    register.set("first_name", response.name);
                    register.set("username", response.name);
                    register.set("email", response.email);
                    register.set("password", dummyPassword);
                    register.save().then(
                        (object) => {
                            Parse.User.logIn(response.name, dummyPassword).then(
                                (result) => {
                                    const currentUser = Parse.User.current();
                                    resolve(currentUser)
                                },
                                (error) => {
                                    reject(error)
                                })
                        },
                        (error) => {
                            reject(
                                "Error from backfor4app while signing up facebook user",
                                error.message
                            );
                        }
                    );
                }
                else {
                    reject('User already exists');
                }
            },
                (error) => {
                    console.error("Error while verifying facebook user for signup", error);
                }
            );
        }
        else {
            console.log('Invalid Facebook access token')
        }
    })
}


