import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import UserLogin from "./UserLogin";
import { useForm } from "react-hook-form";
import { Parse } from "parse";
import RoutingHistory from "../../RoutingHistory";
import { LoginContext } from "../../contextapi/LoginContext";
import { getGoogleAuthData, getGoogleUser, SignUpGoogleUser } from '../../Components/utils/Authentication/ParseGoogle';
import { parseFbLogin } from '../../Components/utils/Authentication/ParseFacebook';
import { handleLogin } from '../../Components/utils/Authentication/Login';
import { PopupModal } from "../../Standalone/PopupModal";

const AccountPage = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [googleSignUpClicked, setGoogleSignUpClick] = useState(sessionStorage.getItem('isGoogleSignUpClick') || false);
  const [mobile, setMobile] = useState();
  const { addUserName } = useContext(LoginContext);
  const { register, handleSubmit, errors, getValues } = useForm();
  const [show2, setShow2] = useState(false);
  const [showGoogleSignUpError, setShowGoogleSignUpError] = useState(false);
  const [googleSignUpErrorMessage, setGoogleSignUpErrorMessage] = useState();
  const [showFBSignUpError, setshowFBSignUpError] = useState(false);
  const [showSignUpError, setShowSignUpError] = useState(false);
  const [signUpError, setSignUpError] = useState();

  const [fbSignUpErrorMessage, setFBSignUpErrorMessage] = useState(false);

  const isCodeRecieved = window.location.pathname === '/redirect';
  const handleClose2 = () => { console.log('close'); setShow2(false) };
  const handleSignUpError = () => setSignUpError(false);
  const handleGooglerSignUpError = () => setShowGoogleSignUpError(false);
  const handleFBSignupError = () => setshowFBSignUpError(false);

  useEffect(() => {

    if (isCodeRecieved && googleSignUpClicked) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const code = urlParams.get('code');

      const fetchGoogleData = async () => {
        let authResponse = '';
        ;
        let googleUser = '';
        let googleSignUpRes = '';
        try {
          authResponse = await getGoogleAuthData(code);
          ;
          googleUser = await getGoogleUser(authResponse);
          googleSignUpRes = await SignUpGoogleUser(authResponse, googleUser);

        }
        catch (error) {
          setShowGoogleSignUpError(true);
          setGoogleSignUpErrorMessage(error.message)
        }

        if (googleSignUpRes) {
          setShow2(true);
          alert('New user created successfully.');
          RoutingHistory.push('/');
          addUserName(googleSignUpRes)
        }
        else {
          console.log('Google user failed to Signup');
        }
      }
      fetchGoogleData();

    }
    sessionStorage.removeItem('isGoogleSignUpClick');
    setGoogleSignUpClick(false);
  }, [isCodeRecieved, googleSignUpClicked])

  const showGoogleSignUp = async () => {
    // setGoogleSignUpClick(true);
    sessionStorage.setItem('isGoogleSignUpClick', true);
    const dev_redirect_url = "https://localhost:3000/redirect";
    // const production_redirect_url = "https://technowise360.herokuapp.com/redirect";
    const REDIRECT_URI = dev_redirect_url;

    const CLIENT_ID = '678868899339-m3v1l1hjphuqvna2je9dtkl4bpoo1ap0.apps.googleusercontent.com';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${REDIRECT_URI}&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.profile+&access_type=offline
`
    window.location = url;
  }
  // const handleGoogleSignUp = (response) => {
  //   if (response) {
  //     console.log('handleGoogleSignUp');
  //     addUserName(response);
  //     RoutingHistory.push("/");
  //   }
  // }

  const handleParseFbSignUp = async () => {
    try {
      const user = await parseFbLogin();
      addUserName(user);
      RoutingHistory.push("/");
    }
    catch (error) {
      setshowFBSignUpError(true);
      setFBSignUpErrorMessage(error.message);
    }

  }

  const handleContinue = () => {
    const UserRegister = Parse.Object.extend("_User");
    const register = new UserRegister();
    register.set("first_name", firstName);
    register.set("last_name", lastName);
    register.set('userType', 'customer');
    register.set('isAdmin', false)
    register.set("username", username);
    register.set("email", email);
    register.set("password", password);
    register.set('userType', 'customer');
    register.set('isAdmin', false);
    register.set("phone", mobile);
    register.set('address', { "__type": "Pointer", "className": "UserAddress", "objectId": undefined });
    register.signUp().then(
      (object) => {
        //save success
        setShow2(true)
        handleLogin(username, password).then(loginUser => {
          addUserName(loginUser);
          RoutingHistory.push("/");
        }, (error) => {
          setSignUpError(error);
          setShowSignUpError(true);
        });

      },
      (error) => {
        // Save fails
        setShowSignUpError(true)
        setSignUpError(error.message)
      }
    );
  };
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleMobileNumber = (e) => {
    setMobile(parseInt(e.target.value));
  };

  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <ul>
                <li className="home">
                  {" "}
                  <Link title="Go to Home Page" to="/">
                    Home
                  </Link>
                  <span>&raquo;</span>
                </li>
                <li>
                  <strong>My Account</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="main-container col1-layout">
        <div className="main container">
          <div className="page-content">
            <div className="account-login">
              <UserLogin />
              <div className="col-md-1"></div>
              <div className="col-md-7">
                <div className="page-title">
                  <h1>Register</h1>
                </div>
                <div className="md-pl-0">
                  <p>Create your very own account</p>
                  <form>
                    <div className="col-md-6">
                      <label for="">First Name</label>
                      <input
                        type="text"
                        className="form-control input"
                        name="first_name"
                        onChange={handleFirstName}
                        ref={register({
                          required: {
                            value: true,
                            message: "You must enter your first name",
                          },
                          minLength: {
                            value: 3,
                            message: "Your name must be at least 3 characters",
                          },
                        })}
                      />
                      {errors.first_name && (
                        <div style={{ color: "red" }} className="error">
                          {errors.first_name.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Last Name</label>
                      <input
                        type="text"
                        className="form-control input"
                        name="last_name"
                        onChange={handleLastName}
                        ref={register({
                          required: {
                            value: true,
                            message: "You must enter your last name",
                          },
                          minLength: {
                            value: 3,
                            message: "Your name must be at least 3 characters",
                          },
                        })}
                      />
                      {errors.last_name && (
                        <div style={{ color: "red" }} className="error">
                          {errors.last_name.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-12">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control input"
                        name="email"
                        onChange={handleEmail}
                        ref={register({
                          required: {
                            value: true,
                            message: "You must enter your eamil",
                          },
                          pattern: {
                            value: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please use a valid email address",
                          },
                        })}
                      />
                      {errors.email && (
                        <div style={{ color: "red" }} className="error">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Username</label>
                      <input
                        type="text"
                        className="form-control input"
                        name="username"
                        onChange={handleUserName}
                        ref={register({
                          required: {
                            value: true,
                            message: "You must enter your user name",
                          },
                          minLength: {
                            value: 3,
                            message: "Your user name must be at least 3 characters",
                          },
                        })}
                      />
                      {errors.username && (
                        <div style={{ color: "red" }} className="error">
                          {errors.username.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        className="form-control input"
                        name="number"
                        onChange={handleMobileNumber}
                        ref={register({
                          valueAsNumber: true,
                          required: {
                            value: true,
                            message: "You must enter your mobile number",
                          },
                          minLength: {
                            value: 11,
                            message:
                              "Your mobile number must be numbers and at least 11 characters",
                          },
                          maxLength: {
                            value: 11,
                            message: "Maximum number character limit is 11"
                          }
                        })}
                      />
                      {errors.number && (
                        <div style={{ color: "red" }} className="error">
                          {errors.number.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control input"
                        name="password"
                        onChange={handlePassword}
                        ref={register({
                          required: {
                            value: true,
                            message: "You must enter your password",
                          },
                          minLength: {
                            value: 6,
                            message: "Your password must be at least 6 characters",
                          },
                          pattern: {
                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/,
                            message: "Invalid Password[6 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character]"
                          }
                        })}
                      />
                      {errors.password && (
                        <div style={{ color: "red" }} className="error">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        className="form-control input"
                        name="confirm_password"
                        onChange={handleConfirmPassword}
                        ref={register({
                          validate: value =>
                            value === getValues().password || "The passwords do not match",
                          required: {
                            value: true,
                            message: "You must confirm your password",
                          },
                          minLength: {
                            value: 6,
                            message: "Your password must be at least 6 characters",
                          },
                        })}
                      />
                      {errors.confirm_password && (
                        <div style={{ color: "red" }} className="error">
                          {errors.confirm_password.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-12">
                      <button
                        onClick={handleSubmit(handleContinue)}
                        className="button"
                      >
                        <i className="fa fa-angle-double-left"></i>&nbsp;{" "}
                        <span>Register</span>
                      </button>
                    </div>
                  </form>
                  <div className="col-md-12">
                    <div className="register-benefits">
                      <h5>Sign up today and you will be able to :</h5>
                      <ul>
                        <li>Speed your way through checkout</li>
                        <li>Track your orders easily</li>
                        <li>Keep a record of all your purchases</li>
                      </ul>
                    </div>
                    <button onClick={() => handleParseFbSignUp()} className="loginBtn loginBtn--facebook">
                      Signup with Facebook
                    </button>
                    <button onClick={() => showGoogleSignUp()} className="loginBtn loginBtn--google">
                      Signup with Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PopupModal showModal={show2} handleClose={handleClose2} modalBody='Please Check your Email to verify your account.' />
        {showSignUpError &&
          <PopupModal showModal={showSignUpError} handleClose={handleSignUpError} modalBody={signUpError} />
        }
        {showGoogleSignUpError &&
          <PopupModal showModal={showGoogleSignUpError} handleClose={handleGooglerSignUpError} modalBody={googleSignUpErrorMessage} />
        }
        {showFBSignUpError &&
          <PopupModal showModal={showFBSignUpError} handleClose={handleFBSignupError} modalBody={fbSignUpErrorMessage} />
        }

      </section>
    </>
  );
}

export default AccountPage;
