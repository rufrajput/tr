import { Parse } from "parse";

export const googleLoginResponse = (response) => {
    return new Promise((resolve, reject) => {
        if (response.error) {
            alert("Google login error");
        }
        else {
            const User = new Parse.User();
            const query = new Parse.Query(User);
            query.equalTo("email", response.profileObj.email);
            query.find().then(user => {
                if (user.length === 1) {
                    const dummyPassword = "tayyab123456";
                    Parse.User.logIn(response.profileObj.givenName, dummyPassword).then(
                        (result) => {
                            const currentUser = Parse.User.current();
                            resolve(currentUser);
                        },
                        (error) => {
                            reject('Login Failed: ', error);
                        }
                    );
                }
                else {
                    reject(new Error("No user found"))
                }
            },
                (error) => {
                    reject('Error while fetching Google user', error)
                }
            );
        }
    })

};

export const googleSignupResponse = (response) => {
    if (response.error) {
        alert('Google Signup error:');
    }
    else {
        const User = new Parse.User();
        const query = new Parse.Query(User);
        query.equalTo("email", response.profileObj.email);
        query.find().then(user => {
            console.log("User found", user.length);
            if (user.length === 0) {
                const dummyPassword = "tayyab123456";
                const UserRegister = Parse.Object.extend("User");
                const register = new UserRegister();
                register.set("first_name", response.profileObj.givenName);
                register.set("last_name", response.profileObj.familyName);
                register.set("username", response.profileObj.givenName);
                register.set("email", response.profileObj.email);
                register.set("password", dummyPassword);
                register.save().then(
                    (object) => {
                        Parse.User.logIn(response.profileObj.givenName, dummyPassword).then(
                            (result) => {
                                const currentUser = Parse.User.current();
                            },
                            (error) => {

                            })
                    },
                    (error) => {
                        alert(
                            "Error from backfor4app while signing up google user",
                            error.message
                        );
                    }
                );
            }
            else {
                alert('User already exists');
            }
        },
            (error) => {
                console.error("Error while verifying google user for signup", error);
            }
        );
    }
    console.log('google response: ', response);
}