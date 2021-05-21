import React from 'react';
import { useForm } from "react-hook-form";
// import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  // const location = useLocation();
  // const [password, setPassword] = useState()
  const { register, handleSubmit, errors } = useForm()


  const handleConfirmPassword = () => {

  }

  const handlePassword = (e) => {
    // setPassword(e.target.value)
  }

  return (
    <>
      <section className="main-container col2-right-layout">
        <div className="main container">
          <div className="row">
            <div className="col-main col-sm-9 col-xs-12">
              <div className="page-title">
                <h1>Reset Password</h1>
              </div>
              <br />
              <div className="box-border">
                <p>Please Enter Your New Password</p>
                <label for="emmail_register">Password<span className="required">*</span></label>
                <input type="password"
                  className="form-control input"
                  name="password"
                  onChange={handlePassword}
                  ref={register({
                    required: {
                      value: true,
                      message: "You must enter your password"
                    },
                    minLength: {
                      value: 6,
                      message: "Your password must be at least 6 characters"
                    }
                  })} />
                {errors.password && (
                  <div style={{ color: 'red' }} className="error">{errors.password.message}</div>
                )}
                <label for="emmail_register">Confirm Password<span className="required">*</span></label>
                <input type="password"
                  className="form-control input"
                  name="confirm_password"
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
                <button onClick={handleSubmit(handleConfirmPassword)} className="button"><i className="icon-user icons"></i>&nbsp; <span>Confirm</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ResetPassword;