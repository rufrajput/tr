import React from 'react';

const CreditCard = () => {

  return (
    <>
      <div className="paymentform">
        <div className="col-75">
          <div className="paymentcontainer">
            <div className="col-50">
              <h3>Credit Card</h3>
              <label className="paymentlabel" for="cname">Name on Card</label>
              <input className="paymentinput" type="text" id="cname" name="cardname" placeholder="Name on Card" />
              <label className="paymentlabel" for="ccnum">Credit card number</label>
              <input className="paymentinput" type="text" id="ccnum" name="cardnumber" placeholder="Card Number" />
              <label className="paymentlabel" for="expyear">Exp Date</label>
              <input className="paymentinput" type="text" id="expyear" name="expyear" placeholder="MM/YY" />
              <div className="row">
                <div className="col-50">
                  <label className="paymentlabel" for="cvv">CVV</label>
                  <input className="paymentinput" type="text" id="cvv" name="cvv" placeholder="CVV" />
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '20px' }}>
                <button>Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreditCard;