import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Parse } from "parse";
import { Button, Modal } from 'react-bootstrap';

const ConfirmEmail = () => {

  const [email, setEmail] = useState();
  const { register, handleSubmit, errors } = useForm();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleConfirm = () => {
    setShow(true)
    Parse.User.requestPasswordReset(email).then(() => {
      console.log('Reset password email sent successfully');
    }).catch((error) => {
      console.error('Error while creating request to reset user password', error);
    })
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  return (
    <>
      <section className="main-container col2-right-layout">
        <div className="main container">
          <div className="row">
            <div className="col-main col-sm-9 col-xs-12">
              <div className="page-title">
                <h1>Email Confirmation</h1>
              </div>
              <div>
                <Modal size='md' animation={false} show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                  </Modal.Header>
                  <Modal.Body>
                    check your Email Address to reset Password
                    if you not received plz check your email address
                    and try again
                  </Modal.Body>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                  </Button>

                  </Modal.Footer>
                </Modal>
              </div>
              <br />
              <div className="box-border">
                <p>Please Confirm Your Email for Password Reset</p>
                <label for="emmail_register">Email address<span className="required">*</span></label>
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
                <button onClick={handleSubmit(handleConfirm)} className="button"><i className="icon-user icons"></i>&nbsp; <span>Confirm</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ConfirmEmail;