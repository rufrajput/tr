import React, { useState, useContext, useEffect } from 'react';
import RoutingHistory from '../../RoutingHistory';
import { useForm } from "react-hook-form";
import { Parse } from "parse";
import LoginAtCheckout from '../../Pages/Sections/LoginAtCheckout';
import { handleLogin } from '../../Components/utils/Authentication/Login';
import { CartContext } from '../../contextapi/context_cart';
import { Button, Modal } from 'react-bootstrap';
import { LoginContext } from "../../contextapi/LoginContext";
import { PopupModal } from "../../Standalone/PopupModal";
import { message } from 'antd';


const CheckOut = () => {

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const [checkoutOption, setCheckoutOption] = useState();
  const [isShowMessage, setShowMessage] = useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUserName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const { item } = useContext(CartContext);
  const { addUserName, addUserGuest } = useContext(LoginContext);
  const [showSignUpError, setShowSignUpError] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const { register, handleSubmit, errors } = useForm()
  let subTotal = 0;

  useEffect(() => {
     subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);
  },[item])

  const handleCheckoutOption = (e) => {
    setCheckoutOption(e.target.value)
    addUserGuest(e.target.value)
    setShowMessage(false)
  }

  const handleSignUpError = () => setSignUpError(false);
  const handleContinue = () => {
    if (checkoutOption === 'Guest') {
      RoutingHistory.push('/billinginfo')

    } else {
      if (checkoutOption === 'Register') {

        const RegisterUser = Parse.Object.extend("_User");
        const register = new RegisterUser();
        register.set('first_name', firstName);
        register.set('userType', 'customer');
        register.set('isAdmin', false)
        register.set('last_name', lastName);
        register.set('username', username);
        register.set('email', email);
        register.set('phone', phoneNumber);
        register.set('password', password);
        register.set('address', { "__type": "Pointer", "className": "UserAddress", "objectId": undefined });
        register.signUp()
          .then((object) => {
            setShow2(true)
            handleLogin(username, password).then(loginUser => {
              addUserName(loginUser);
              RoutingHistory.push("/");
            }, (error) => {
              setSignUpError(error);
              setShowSignUpError(true);
            });
            //save success
            // RoutingHistory.push('/billinginfo')
          }, (error) => {
            setShow(true)
            setError(error.message)
          });
      }
      else {
        setShowMessage(true)
      }
    }
  }
  const handleFirstName = (e) => {
    setFirstName(e.target.value)
  }
  const handleLastName = (e) => {
    setLastName(e.target.value)
  }
  const handleUserName = (e) => {
    setUserName(e.target.value)
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }
  const handlePhoneNumber = (e) => {
    setPhoneNumber(parseInt(e.target.value))
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  return (
    <>
      <section className="main-container col2-right-layout">
        {console.log('subTotal, item: ', subTotal, item)}
        {item.length > 0 ?
          <div className="main container">
            <div>
              <Modal size='md' animation={false} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>Failed to create new user:  {error}
               Your User Name And Email Must be unique</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                 </Button>
                </Modal.Footer>
              </Modal>
              <div>
                <Modal size='lg' animation={false} show={show2} onHide={handleClose2}>
                  <Modal.Header closeButton>
                  </Modal.Header>
                  <Modal.Body> Please Check your Email to verify your account.</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                      Close
                 </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <div className="row">
              <div className="col-main col-sm-9 col-xs-12">
                <div className="page-title">
                  <h2>Checkout</h2>
                </div>
                <div className="page-content checkout-page">
                  <br />
                  <div className="box-border">
                    <div className="row">
                      <div className="col-sm-6">
                        <h5>Checkout as a Guest or Register</h5>
                        <p>Register with us for future convenience:</p>
                        <form>
                          <ul>
                            <li>
                              <label>
                                <input type="radio" value="Guest" name="radio1" onClick={handleCheckoutOption} checked={checkoutOption === 'Guest'} />
                                Checkout as Guest
                              </label>
                            </li>
                            <li>
                              <label>
                                <input type="radio" value="Register" name="radio1" onClick={handleCheckoutOption} checked={checkoutOption === 'Register'} />
                              Register
                            </label>
                            </li>
                          </ul>
                        </form>
                        <br />
                        {
                          checkoutOption && checkoutOption === 'Register' ?
                            <form >
                              <h5>Register</h5>
                              <label>First Name</label>
                              <input type="text"
                                className="form-control input"
                                name="first_name"
                                onChange={handleFirstName}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "You must enter your first name"
                                  },
                                  minLength: {
                                    value: 3,
                                    message: "Your name must be at least 3 characters"
                                  }
                                })} />
                              {errors.first_name && (
                                <div style={{ color: 'red' }} className="error">{errors.first_name.message}</div>
                              )}
                              <label>Last Name</label>
                              <input type="text"
                                className="form-control input"
                                name="last_name"
                                onChange={handleLastName}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "You must enter your last name"
                                  },
                                  minLength: {
                                    value: 3,
                                    message: "Your name must be at least 3 characters"
                                  }
                                })} />
                              {errors.last_name && (
                                <div style={{ color: 'red' }} className="error">{errors.last_name.message}</div>
                              )}
                              <label>Username</label>
                              <input type="text"
                                className="form-control input"
                                name="username"
                                onChange={handleUserName}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "You must enter your user name"
                                  },
                                  minLength: {
                                    value: 3,
                                    message: "Your user name must be at least 3 characters"
                                  }
                                })} />
                              {errors.username && (
                                <div style={{ color: 'red' }} className="error">{errors.username.message}</div>
                              )}
                              <label>Phone Number</label>
                              <input type="text"
                                className="form-control input"
                                name="phone_number"
                                onChange={handlePhoneNumber}
                                ref={register({
                                  valueAsNumber: true,
                                  required: {
                                    value: true,
                                    message: "You must enter your Phone number"
                                  },
                                  minLength: {
                                    value: 11,
                                    message: "Your phone must be Number and at least 11 characters"
                                  },
                                 maxLength:{
                                    value:11,
                                    message: "Maximum number character limit is 11"
                                    }
                                })} />
                              {errors.phone_number && (
                                <div style={{ color: 'red' }} className="error">{errors.phone_number.message}</div>
                              )}
                              <label>Email address</label>
                              <input type="email"
                                className="form-control input"
                                name="email"
                                onChange={handleEmail}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "You must enter your eamil"
                                  },
                                  pattern: {
                                    value: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Please use a valid email address'
                                  },

                                })} />
                              {errors.email && (
                                <div style={{ color: 'red' }} className="error">{errors.email.message}</div>
                              )}
                              <label>Password</label>
                              <input type="password"
                                className="form-control input"
                                name="password"
                                type="password"
                                onChange={handlePassword}
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "You must enter your password"
                                  },
                                  minLength: {
                                    value: 6,
                                    message: "Your password must be at least 6 characters"
                                  },
                                  pattern:{
                                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/,
                                    message: "Invalid Password[6 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character]"
                                  }
                                })} />
                              {errors.password && (
                                <div style={{ color: 'red' }} className="error">{errors.password.message}</div>
                              )}
                              <label>Confirm Password</label>
                              <input type="password"
                                className="form-control input"
                                name="confirm_password"
                                type="password"
                                ref={register({
                                  required: {
                                    value: true,
                                    message: "You must confirm your password"
                                  },
                                  minLength: {
                                    value: 6,
                                    message: "Your password must be at least 6 characters"
                                  }
                                })} />
                              {errors.confirm_password && (
                                <div style={{ color: 'red' }} className="error">{errors.confirm_password.message}</div>
                              )}
                            </form>
                            :
                            null
                        }
                        <div>
                          <h4>Register and save time!</h4>
                          <p>Register with us for future convenience:</p>
                          <p><i className="fa fa-check-circle text-primary"></i> Fast and easy check out</p>
                          <p><i className="fa fa-check-circle text-primary"></i> Easy access to your order history and status</p>

                          {
                            isShowMessage ?
                              <p style={{ color: 'red' }}>Please select 'Checkout as Guest' or 'Register' option to continue!</p>
                              :
                              null
                          }
                          <button onClick={handleSubmit(handleContinue)} className="button"><i className="fa fa-angle-double-right"></i>&nbsp; <span>Continue</span></button>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <LoginAtCheckout />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : RoutingHistory.push('/')}
        {showSignUpError &&
          <PopupModal showModal={showSignUpError} handleClose={handleSignUpError} modalBody={signUpError} />
        }
      </section>
    </>
  )
}
export default CheckOut;