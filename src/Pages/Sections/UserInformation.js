import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import RoutingHistory from '../../RoutingHistory';
import { Parse } from "parse";
import { LoginContext } from "../../contextapi/LoginContext";
import { Modal } from 'react-bootstrap';

const UserInformation = () => {
    const { register, handleSubmit, errors } = useForm();
    const { custmerName } = useContext(LoginContext);

    const [editFirstName, setEditFirstName] = useState(custmerName && custmerName.get('first_name'));
    const [editLastName, setEditLastName] = useState(custmerName && custmerName.get('last_name'));
    const [editUserName, setEditUserName] = useState(custmerName && custmerName.get('username'));
    const [editPhone, setEditPhone] = useState(custmerName && custmerName.get('phone'));
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleUpdate = () => {
        const User = new Parse.User();
        const query = new Parse.Query(User);
        // Finds the user by its ID
        query.get(custmerName && custmerName.id).then((user) => {
            // Updates the data we want
            user.set('first_name', editFirstName);
            user.set('last_name', editLastName);
            user.set('username', editUserName);
            user.set('phone', editPhone);
            // Saves the user with the updated data
            user.save().then((response) => {
                setShow(true)
            }).catch((error) => {
                console.error('Error while updating user', error);
            });
        });
    }
    const handleFirstName = (e) => {
        setEditFirstName(e.target.value)
    }
    const handleLastName = (e) => {
        setEditLastName(e.target.value)

    }
    const handleUserName = (e) => {
        setEditUserName(e.target.value)
    }
    const handleMobileNumber = (e) => {
        setEditPhone(parseInt(e.target.value))
    }
    return (
        <>
                   <div>
          <Modal size='lg' className="view_cart" animation={false} show={show} onHide={handleClose}>
              <Link to="/dashboard">
            <Modal.Header closeButton>
            </Modal.Header>
            </Link>
            <Modal.Body>
                   Your Information is Updated successfully.....
            </Modal.Body>
          </Modal>
        </div>
            <section className="main-container col2-right-layout">
              { custmerName && custmerName.get('username') ? <div className="main container">
                    <div className="row">
                        <div className="col-main col-sm-9 col-xs-12">
                            <div className="page-title">
                                <h2>User Information</h2>
                            </div>
                            <br />
                            <div className="box-border">
                                <form className="ps-form--account-setting" method="get">
                                    <div className="ps-form__content">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input
                                                        value={editFirstName}
                                                        type="text"
                                                        className="form-control input"
                                                        name="first_name"
                                                        onChange={handleFirstName}
                                                        onClick
                                                        ref={register({
                                                            required: {
                                                                value: true,
                                                                message: "You must enter your first name"
                                                            },
                                                            minLength: {
                                                                value: 3,
                                                                message: "Your name must be at least 3 characters"
                                                            }
                                                        })}
                                                    />
                                                    {errors.first_name && (
                                                        <div style={{ color: 'red' }} className="error">{errors.first_name.message}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input
                                                        value={editLastName}
                                                        type="text"
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
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Display Name</label>
                                                    <input value={editUserName}
                                                        type="text"
                                                        className="form-control input"
                                                        name="username"
                                                        onChange={handleUserName}
                                                        ref={register({
                                                            required: {
                                                                value: true,
                                                                message: "You must enter your user name"
                                                            },
                                                            minLength: {
                                                                value: 4,
                                                                message: "Your user name must be at least 3 characters"
                                                            }
                                                        })} />
                                                    {errors.username && (
                                                        <div style={{ color: 'red' }} className="error">{errors.username.message}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input value={editPhone}
                                                        type="text"
                                                        className="form-control input"
                                                        name="number"
                                                        onChange={handleMobileNumber}
                                                        ref={register({
                                                            required: {
                                                                valueAsNumber: true,
                                                                value: true,
                                                                message: "You must enter your mobile number"
                                                            },
                                                            minLength: {
                                                                value: 11,
                                                                message: "Your mobile number must be numbers and at least 11 characters"
                                                            },
                                                            maxLength:{
                                                               value:11,
                                                               message: "Maximum number character limit is 11"
                                                               }
                                                        })} />
                                                    {errors.number && (
                                                        <div style={{ color: 'red' }} className="error">{errors.number.message}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>Email Address</label>
                                                    <input type="email"
                                                        className="form-control input"
                                                        value={custmerName && custmerName.get('email')}
                                                        name="email"
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cart_navigation">
                                        <button onClick={handleSubmit(handleUpdate)} className="button pull-right"><i className="fa fa-angle-double-right"></i> <span>Update</span></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <br />
                        <aside className="right sidebar col-sm-3 col-xs-12">
                            <div className="sidebar-account block">
                                <div className="sidebar-bar-title">
                                    <h3>My Account</h3>
                                </div>
                                <div className="block-content">
                                    <ul>
                                        <li ><Link to="/dashboard">My Dashboard</Link></li>
                                        <li className="current"><Link>Account Information</Link></li>
                                        <li><Link to="/orderlist">My Orders</Link></li>
                                        {custmerName && custmerName.get('address').id !== "undefined" ?
                      <li><Link to={`/billingaddress/${custmerName && custmerName.id}`}>Edit Address</Link></li>
                      : null}
                                        <li><Link to="/wishlist">My Wishlist</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>:RoutingHistory.push('/')}
            </section>
        </>
    )
}

export default UserInformation;