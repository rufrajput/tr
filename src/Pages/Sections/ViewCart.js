import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contextapi/context_cart';
import { Parse } from "parse";
import RoutingHistory from "../../RoutingHistory";
import { LoginContext } from '../../contextapi/LoginContext'
import { notification } from 'antd';

const ViewCart = () => {
  const { item, removeItem, incrementItem, decrementItem, setUserComment } = useContext(CartContext);
  const [currencySign, setCurrencySign] = useState();
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);
  const { custmerName } = useContext(LoginContext);
  const [comments, setComments] = useState();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });
  }, []);
  const Toste = () => {
    notification.error({
      message: 'You do not have any product in your cart.'
    });
  }

  const handleComment = (e) => {
    console.log('comment: ', e.target.value);
    setComments(e.target.value);
  }
  const handleProceedCheckOut = () => {
    setUserComment(comments);
    if (custmerName && custmerName.get('username')) {
      RoutingHistory.push('/shippinginfo');
    }
    else {
      RoutingHistory.push('/checkout');
    }
  }

  // const handleProceedCheckOut = () => {
  //   if (subTotal !== 0) {
  //     return (
  //       custmerName && custmerName.get('username') ?
  //         <Link className="checkout-btn" to="/shippinginfo">
  //           <i className="fa fa-check"></i> Proceed to checkout
  //         </Link> :
  //         <Link className="checkout-btn" to="/checkout">
  //           <i className="fa fa-check"></i> Proceed to checkout</Link>

  //     )
  //   }
  //   else {
  //     return (
  //       custmerName && custmerName.get('username') ?
  //         <Link className="checkout-btn" onClick={() => Toste()}>
  //           <i className="fa fa-check"></i> Proceed to checkout
  //                            </Link> :
  //         <Link className="checkout-btn" onClick={() => Toste()} >
  //           <i className="fa fa-check"></i> Proceed to checkout</Link>
  //     )

  //   }
  // }

  return (
    <>
      <section className="main-container col1-layout">
        {subTotal !== 0 ?
        <div className="main container">
          <div className="col-main page-order">
            <div className="row">
              <div className="col-md-8">
                <div className="cart">
                  <div className="page-content "><div className="page-title ">
                    <h2>Shopping Cart</h2>
                  </div>
                    <div className="order-detail-content">
                      <div className="table-responsive">
                        <table className="table table-bordered cart_summary text-center">
                          <thead>
                            <tr>
                              <th className="cart_product">Product</th>
                              <th className="w-10">Name</th>
                              <th>Unit price</th>
                              <th>Qty</th>
                              <th>Total</th>
                              <th className="action"><i className="fa fa-trash-o"></i></th>
                            </tr>
                          </thead>
                          <tbody>
                            {item && item.map((data) => (
                              <tr>

                                <td className="cart_product"><Link ><img src={data.img} alt="Product" /></Link></td>
                                <td className="cart_description"><p className="product-name">{data.name}</p></td>
                                <td className="price"><span>{currencySign} {data.price}</span></td>
                                <td className="qty">
                                  <div className="numbers-row">
                                    <div onClick={() => decrementItem(data.id)} className="dec qtybutton"><i className="fa fa-minus">&nbsp;</i></div>
                                    <div className="itemQty">{data.qty}</div>
                                    {data.qty < data.dbQuantity ?
                                      <div onClick={() => incrementItem(data.id)} className="inc qtybutton"><i className="fa fa-plus">&nbsp;</i></div>
                                      : <div className="inc qtybutton disabled pointer_none"><i className="icon-close">&nbsp;</i></div>}
                                  </div>
                                </td>
                                <td className="price"><span>{currencySign} {data.qty * data.price}</span></td>
                                <td className="action"><i style={{cursor: 'pointer'}} className="icon-close" onClick={() => {
                                  removeItem(data.id)
                                }} ></i></td>
                              </tr>
                            ))}
                            {/* <tr>
                      <td className="cart_product"><a href="#"><img src="../images/products/product-1.jpg" alt="Product"/></a></td>
                      <td className="cart_description"><p className="product-name"><a href="#">Ipsums Dolors Untra </a></p>
                        <small><a href="#">Color : Green</a></small>
                        <small><a href="#">Size : XL</a></small></td>
                      <td className="availability out-of-stock"><span className="label">No stock</span></td>
                      <td className="price"><span>$00.00</span></td>
                      <td className="qty"><input className="form-control input-sm" type="text" value="0"/></td>
                      <td className="price"><span>00.00</span></td>
                      <td className="action"><a href="#"><i className="icon-close"></i></a></td>
                    </tr>
                    <tr> 
                      <td className="cart_product"><a href="#"><img src="../images/products/product-1.jpg" alt="Product"/></a></td>
                      <td className="cart_description"><p className="product-name"><a href="#">Ipsums Dolors Untra </a></p>
                        <small><a href="#">Color : Blue</a></small>
                        <small><a href="#">Size : S</a></small></td>
                      <td className="availability in-stock"><span className="label">In stock</span></td>
                      <td className="price"><span>$99.00</span></td>
                      <td className="qty"><input className="form-control input-sm" type="text" value="2"/></td>
                      <td className="price"><span>$188.00</span></td>
                      <td className="action"><a href="#"><i className="icon-close"></i></a></td>
                    </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="order_summary">
                  <div className="page-content">
                    <div className="page-title">
                      <h2>ORDER SUMMARY</h2>
                    </div>
                    <div className="order-detail-content">
                      <div className="row form-group">
                        <label for="" className="col-md-6 col-form-label">Total:</label>
                        <label for="" className="col-md-6 text-right col-form-label">
                          <strong>{currencySign} {subTotal} </strong>
                        </label>
                      </div>
                      <hr></hr>
                      <div className="row form-group">
                        <label for="comments"
                          className="col-md-12 col-form-label"> Additional comments</label>
                        <div className="col-md-12">
                          <textarea value={comments} onChange={handleComment} className="form-control" name=""
                            id=""></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart_navigation">
              <div className="row">
                <div className="col-md-8">
                  <Link className="continue-btn" to="/">
                    <i className="fa fa-arrow-left"> </i>&nbsp; Continue shopping
                  </Link>
                </div>
                <div className="col-md-4">
                  {/* {handleProceedCheckOut()} */}
                  {
                    subTotal !== 0 ?
                      <Link className="checkout-btn" onClick={handleProceedCheckOut}>
                        <i className="fa fa-check"></i> Proceed to checkout
                        </Link>
                      :
                      custmerName && custmerName.get('username') ?
                        <Link className="checkout-btn" onClick={() => Toste()}>
                          <i className="fa fa-check"></i> Proceed to checkout
                        </Link>
                        :
                        <Link className="checkout-btn" onClick={() => Toste()} >
                          <i className="fa fa-check"></i> Proceed to checkout
                        </Link>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        : RoutingHistory.push('/')}
      </section>
    </>
  )
}

export default ViewCart;