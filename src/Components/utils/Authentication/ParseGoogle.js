import { Parse } from "parse";

const dev_redirect_url = "https://localhost:3000/redirect";
// const production_redirect_url = "https://technowise360.herokuapp.com/redirect";
const redirect_url = dev_redirect_url

export const getGoogleAuthData = async (googleCode) => {
    const bodyData = {
        grant_type: "authorization_code",
        code: googleCode,
        client_id: "678868899339-m3v1l1hjphuqvna2je9dtkl4bpoo1ap0.apps.googleusercontent.com",
        client_secret: "HVm4_JqQX6b_g9prT0qzUsLt",
        redirect_uri: redirect_url,

    }
    const acccessTokenRes = await fetch("https://oauth2.googleapis.com/token", {
        body: JSON.stringify(bodyData),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    const data = await acccessTokenRes.json();
    return data;
}
export const getGoogleUser = async (token) => {
    const accessToken = token.access_token
    if (accessToken) {
        try {
            const userIdRes = await fetch(`https://www.googleapis.com/userinfo/v2/me?access_token=${accessToken}`);
            const userIdData = await userIdRes.json();
            return userIdData;
        }
        catch (error) {
            return error;
        }
    }
    else {
        return new Error('token not set');
    }
}
export const SignUpGoogleUser = (authRes, userObj) => {
    return new Promise((resolve, reject) => {
        const myAuthData = {
            id: userObj.id,
            access_token: authRes.access_token,
            expiration_data: authRes.expires_in.toString(),
        }
        const user = new Parse.User();
        user.linkWith('google', { authData: myAuthData }).then(userResponse => {
            if (!userResponse.existed()) {
                console.log('new user');
                if (userResponse.get('authData').google.access_token) {
                    userResponse.set('username', userObj.given_name);
                    userResponse.set('first_name', userObj.given_name);
                    userResponse.set('last_name', userObj.family_name);
                    userResponse.set('email', userObj.email);
                    userResponse.set('userType', 'customer');
                    userResponse.set('isAdmin', false);
                    userResponse.set('address', { "__type": "Pointer", "className": "UserAddress", "objectId": undefined });
                    userResponse.save().then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        reject(error)
                    });
                }
            }
            else {
                resolve(userResponse)
            }
        }, (err) => {
            console.error('userResponse err: ', err);
            reject(err)
        });
    })
}

export const showGoogleLogin = () => {
    console.log('google login');
    // setGoogleLoginClick(true);
    sessionStorage.setItem('isGoogleLoginClick', true);
    const redirect_uri = redirect_url;
    const CLIENT_ID = '360614147378-dmg7vsrh8upv3qkoflptj2tdt9hl9gpu.apps.googleusercontent.com';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_uri}&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.profile+&access_type=offline
`
    window.location = url;
}

export const fetchGoogleData = async (code, authMethod) => {
    let authResponse = '';
    ;
    let googleUser = '';
    let googleSignUpRes = '';
    let googleLoginRes = '';
    authResponse = await getGoogleAuthData(code);
    ;
    googleUser = await getGoogleUser(authResponse);
    switch (authMethod) {
        case 'login' || 'Login':
            googleLoginRes = await SignUpGoogleUser(authResponse, googleUser);
            break;
        case 'signup' || 'Signup' || 'SignUp':
            googleSignUpRes = await SignUpGoogleUser(authResponse, googleUser);
            break;
        default:
            googleSignUpRes = null;
            googleLoginRes = null;
            break;
    }
    return new Promise((resolve, reject) => {
        if ((authMethod === 'login') && googleLoginRes) {
            resolve(googleLoginRes);
        }
        else if ((authMethod === 'signup') && googleLoginRes) {
            resolve(googleSignUpRes);
        }
        else {
            reject(new Error('Failed to authunticate google user!'));
        }
    })
}