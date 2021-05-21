import React, { useState, useContext, useEffect } from 'react';
import RoutingHistory from '../../RoutingHistory';
import { useForm } from "react-hook-form";
import { Parse } from "parse";
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contextapi/LoginContext';
import { fetchGoogleData, showGoogleLogin } from '../../Components/utils/Authentication/ParseGoogle';
import { parseFbLogin } from '../../Components/utils/Authentication/ParseFacebook';
import { PopupModal } from '../../Standalone/PopupModal';

const LoginAtCheckout = () => {
    const { register, handleSubmit, errors } = useForm();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    // const [isLoggedin, setLoggedIn] = useState(false);
    const [showLoginMsg, setLoginMsg] = useState(false);
    const { addUserName } = useContext(LoginContext);
    const [googleLoginClicked, setGoogleLoginClick] = useState(sessionStorage.getItem('isGoogleLoginClick') || false);
    const [showGoogleLoginError, setshowGoogleLoginError] = useState(false);
    const [showFBLoginError, setshowFBLoginError] = useState(false);
    const [googleLoginErrorMessage, setGoogleLoginErrorMessage] = useState(false);
    const [fbLoginErrorMessage, setFBLoginErrorMessage] = useState(false);
    const isCodeRecieved = window.location.pathname === '/redirect';

    const handleGoogleLoginError = () => setshowGoogleLoginError(false);
    const handleFBLoginError = () => setshowFBLoginError(false);

    useEffect(() => {
        if (isCodeRecieved && googleLoginClicked) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get('code');

            const fetchGoogleUser = async () => {
                try {
                    const googleResponse = await fetchGoogleData(code, 'login');
                    console.log('inside fetchGoogleUser try: ', googleResponse);
                    handleGoogleLogin(googleResponse);
                }
                catch (err) {
                    setshowGoogleLoginError(true)
                    setGoogleLoginErrorMessage(err.message)
                }
            }
            fetchGoogleUser();

        }
        sessionStorage.removeItem('isGoogleLoginClick');
        setGoogleLoginClick(false);
    }, [isCodeRecieved, googleLoginClicked])

    const handleGoogleLogin = (response) => {
        if (response) {
            addUserName(response);
        }
    }
    const handleParseFbLogin = async () => {
        try {
            const user = await parseFbLogin();
            addUserName(user);
        }
        catch (error) {
            console.log('FB login error: ', error);
            setshowFBLoginError(true);
            setFBLoginErrorMessage(error.message);
        }

    }
    const NameHandle = (e) => {
        setUserName(e.target.value)
        setLoginMsg(false);
    }
    const PasswordHandle = (e) => {
        setPassword(e.target.value)
        setLoginMsg(false);
    }
    const handleLogin = () => {
        Parse.User.logIn(username, password).then(
            (result) => {
                const currentUser = Parse.User.current();
                addUserName(currentUser)
                RoutingHistory.push('/shippinginfo')
                // setLoggedIn(true)
                setLoginMsg(false);
            },
            (error) => {
                // setLoggedIn(false);
                setLoginMsg(true);
            }
        );
    }
    return (
        <>
            <h5>Login</h5>
            <p>Welcome back! Sign in to your account</p>
            <label>Username</label>
            <input type="text"
                className="form-control input"
                name="username"
                onChange={NameHandle}
                ref={register({
                    required: {
                        value: true,
                        message: "You must enter your user name",
                    },
                    minLength: {
                        value: 3,
                        message: "Your name must be at least 3 characters",
                        color: "red"
                    }
                })} />
            {errors.username && (
                <p style={{ color: 'red' }} className="validationError" >{errors.username.message}</p >
            )}
            <label>Password</label>
            <input type="password"
                className="form-control input"
                name="password"
                type="password"
                onChange={PasswordHandle}
                ref={register({
                    required: {
                        value: true,
                        message: "You must enter your password"
                    },
                    minLength: {
                        value: 6,
                        message: "Your password must be at least 6 characters"
                    },
                    // pattern:{
                    //     value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/,
                    //     message: "Invalid Password Entered"
                    //   }
                })} />
            {errors.password && (
                <p style={{ color: 'red' }} className="validationError">{errors.password.message}</p >
            )}
            {
                showLoginMsg ? <p style={{ color: 'red' }}>invalid username or password entered. OR your account may be not verified (If not first verify it) </p> : null
            }

            <button onClick={handleSubmit(handleLogin)} className="button"><i className="icon-login"></i>&nbsp; <span>Login</span></button>
            <label className="inline" for="rememberme">
                <input type="checkbox" value="forever" id="rememberme" name="rememberme" style={{ marginRight: '5px', verticalAlign: 'sub' }} />
              Remember me </label>
            <br />
            <br />
            <Link to="/confirmemail">Forgot your password?</Link>
            <br />
            <br />
            <button className="loginBtn loginBtn--facebook" onClick={() => handleParseFbLogin()}>
                Login with Facebook
            </button>

            <button className="loginBtn loginBtn--google" onClick={() => showGoogleLogin()}>
                Login with Google
            </button>
            {showGoogleLoginError &&
                <PopupModal showModal={showGoogleLoginError} handleClose={handleGoogleLoginError} modalBody={googleLoginErrorMessage} />
            }
            {showFBLoginError &&
                <PopupModal showModal={showFBLoginError} handleClose={handleFBLoginError} modalBody={fbLoginErrorMessage} />
            }
        </>
    )
}
export default LoginAtCheckout;