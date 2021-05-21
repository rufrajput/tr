import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contextapi/LoginContext';
import { Parse } from 'parse';
import RoutingHistory from '../../RoutingHistory';
import { LoaderSet } from '../../ParseConfig'
const OrderList = () => {

  const { custmerName } = useContext(LoginContext);
  const [orderList, setOrderList] = useState();
  const [currencySign, setCurrencySign] = useState();
  const [loader, setLoader] = useState(true);
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

    const OrderList = Parse.Object.extend('Order');
    const orderlist = new Parse.Query(OrderList);
    orderlist.include('user')
    orderlist.equalTo("user", Parse.User.current())
    orderlist.find().then((results) => {
      setOrderList(results);
      setLoader(false)
    }, (error) => {
      console.error('Error while fetching Order', error);
    });

  }, []);
  return (
    <>
      <section className="main-container col2-right-layout">
        {custmerName && custmerName.get('username') ? <div className="main container">
          <div className="row">
            <div className="col-main col-sm-9 col-xs-12">
              <div className="my-account">
                <div className="page-title">
                  <h2>My OrderList</h2>
                </div>
                <div className="dashboard">
                  <div className="recent-orders">
                    <div className="title-buttons"><strong>Recent Orders</strong> </div>
                    <br />
                    <div className="table-responsive">
                      <table className="table table-bordered cart_summary table-striped">
                        <thead>
                          <tr className="first last">
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Ship to</th>
                            <th><span className="nobr">Order Total</span></th>
                            <th>Status</th>
                            <th>Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderList && orderList.length !== 0 ?
                            <>
                              {orderList.map((data) =>
                                <tr className="first odd">
                                  <td>{data.id}</td>
                                  <td>{data.get('createdAt').getDate()}/{data.get('createdAt').getMonth() + 1}/{data.get('createdAt').getFullYear()}
                                    {/* {data.get('createdAt').getHours()} : {data.get('createdAt').getMinutes()} : {data.get('createdAt').getSeconds()} */}
                                  </td>
                                  <td>{data.get('user').get('username')}</td>
                                  <td><span className="price">{currencySign} {data.get("amount")}</span></td>
                                  <td><em>{data.get("status")}</em></td>
                                  <td><em>{data.get("paymentStatus")}</em></td>
                                </tr>
                              )}
                            </>
                            : loader ? LoaderSet() : <h4>Sorry Your Order List is Empty</h4>}
                          {/* <tr className="last even">
                        <td>987654</td>
                        <td>10/12/2017 </td>
                        <td> jones d</td>
                        <td><span className="price">$79.99</span></td>
                        <td><em>Pending</em></td>
                        <td className="a-center last"><span className="nobr"> <a href="#">View Order</a> <span className="separator">|</span> <a href="#">Reorder</a> </span></td>
                      </tr>
                      <tr className="first odd">
                        <td>1234567</td>
                        <td>10/05/2017 </td>
                        <td> jones d</td>
                        <td><span className="price">$49.00</span></td>
                        <td><em>Pending</em></td>
                        <td className="a-center last"><span className="nobr"> <a href="#">View Order</a> <span className="separator">|</span> <a href="#">Reorder</a> </span></td>
                      </tr>
                      <tr className="last even">
                        <td>987654</td>
                        <td>10/12/2017 </td>
                        <td> jones d</td>
                        <td><span className="price">$79.99</span></td>
                        <td><em>Pending</em></td>
                        <td className="a-center last"><span className="nobr"> <a href="#">View Order</a> <span className="separator">|</span> <a href="#">Reorder</a> </span></td>
                      </tr>
                      <tr className="first odd">
                        <td>1234567</td>
                        <td>10/05/2017 </td>
                        <td> jones d</td>
                        <td><span className="price">$49.00</span></td>
                        <td><em>Pending</em></td>
                        <td className="a-center last"><span className="nobr"> <a href="#">View Order</a> <span className="separator">|</span> <a href="#">Reorder</a> </span></td>
                      </tr>
                      <tr className="last even">
                        <td>987654</td>
                        <td>10/12/2017 </td>
                        <td> jones d</td>
                        <td><span className="price">$79.99</span></td>
                        <td><em>Pending</em></td>
                        <td className="a-center last"><span className="nobr"> <a href="#">View Order</a> <span className="separator">|</span> <a href="#">Reorder</a> </span></td>
                      </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* <div className="wishlist-item table-responsive">
                  <table className="col-md-12">
                    <thead>
                      <tr>
                        <th className="th-delate">Remove</th>
                        <th className="th-product">Images</th>
                        <th className="th-details">Product Name</th>
                        <th className="th-price">Unit Price</th>
                        <th className="th-total th-add-to-cart">Add to Cart </th>
                      </tr>
                    </thead>
                    <tbody>
                      {wish && wish.map((data) => (
                        <tr>
                          <td className="th-delate" onClick={() => {
                            removeToWish(data.id)
                            removeItem(data.id)

                          }}><a href="#">X</a></td>
                          <td className="th-product"><a href="#"><img src={data.img} alt="cart" /></a></td>
                          <td className="th-details"><h2><a href="#">{data.name}</a></h2></td>
                          <td className="th-price">{currencySign} {data.price}</td>
                          <th className="td-add-to-cart" onClick={() => handle(data.id, true)}><a href="#"> Add to Cart</a></th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <a className="all-cart" onClick={() => handleAddAllToCart(wish)}>Add all to cart</a> </div> */}
                </div>
              </div>
            </div>
            <aside className="right sidebar col-sm-3 col-xs-12">
              <div className="sidebar-account block">
                <div className="sidebar-bar-title">
                  <h3>My Account</h3>
                </div>
                <div className="block-content">
                  <ul>
                    <li><Link to="/dashboard">My Dashboard</Link></li>
                    <li><Link to="/userinformation">Account Information</Link></li>
                    <li className="current"><Link>My Orders</Link></li>
                    {/* <li><Link to="/billingaddress">Billing Address</Link></li> */}
                    <li><Link to="/wishlist">My Wishlist</Link></li>
                  </ul>
                </div>
              </div>
              {/* <div className="compare block">
                <div className="sidebar-bar-title">
                  <h3>Compare Products (2)</h3>
                </div>
                <div className="block-content">
                  <ol id="compare-items">
                    <li className="item"> <a href="#" title="Remove This Item" className="remove-cart"><i className="icon-close"></i></a> <a href="#" className="product-name">Vestibulum porta tristique porttitor.</a> </li>
                    <li className="item"> <a href="#" title="Remove This Item" className="remove-cart"><i className="icon-close"></i></a> <a href="#" className="product-name">Lorem ipsum dolor sit amet</a> </li>
                  </ol>
                  <div className="ajax-checkout">
                    <Link to="/compare" ><button type="submit" title="Submit" className="button button-compare"> <span> Compare</span></button></Link>
                    <button type="submit" title="Submit" className="button button-clear"> <span> Clear All</span></button>
                  </div>
                </div>
              </div> */}
            </aside>
          </div>
        </div> : RoutingHistory.push('/')}
      </section>

    </>
  )
}

export default OrderList;