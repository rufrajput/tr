import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contextapi/LoginContext';
import { LoaderSet } from '../../ParseConfig'
import RoutingHistory from '../../RoutingHistory';
import { Parse } from 'parse';

const Dashboard = () => {
  const { custmerName } = useContext(LoginContext);
  const [orderList, setOrderList] = useState();
  const [checkAddress, setCheckAddress] = useState();
  const [currencySign, setCurrencySign] = useState();
  const [gettingData, setGettingData] = useState();
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
    orderlist.limit(3);
    orderlist.include('user');
    orderlist.equalTo("user", Parse.User.current());
    orderlist.find().then((results) => {
      setLoader(false)
      setOrderList(results);
    }, (error) => {
      console.error('Error while fetching Order', error);
    });
    if (custmerName && custmerName.get('address').id !== "undefined") {
      const UserAddress = Parse.Object.extend('_User');
      const useraddress = new Parse.Query(UserAddress);
      useraddress.include('address');
      useraddress.get(Parse.User.current().id).then((results) => {
        setCheckAddress(results);
        let DataGetting = results.get('address').id
        const GetData = Parse.Object.extend('UserAddress');
        const dataget = new Parse.Query(GetData);
        dataget.include("city");
        dataget.include("country");
        dataget.include('province')
        dataget.get(DataGetting).then((res) => {
          setGettingData(res);
        })
      }, (error) => {
        console.error('Error while fetching Order', error);
      });
    }

  }, []);
  return (
    <>
      <section className="main-container col2-right-layout">
        {custmerName && custmerName.get('username') ? <div className="main container">
          <div className="row pb-2">
            <div className="col-main col-sm-9 col-xs-12">
              {console.log("Customer Address", custmerName && custmerName.get('address').id)}
              <div className="my-account">
                <div className="page-title">
                  <h2>My Dashboard</h2>
                </div>
                <div className="dashboard">
                  <div className="welcome-msg"> <strong>Hello, {custmerName && custmerName.get('username')}!</strong>
                    <p>From your Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.</p>
                  </div>
                  <div className="recent-orders">
                    <div className="title-buttons"><strong>Recent Orders</strong> <Link to="/orderlist">View All </Link> </div>
                    <div className="table-responsive">
                      <table className="table table-bordered cart_summary table-striped">
                        <thead>
                          <tr className="first last">
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Ship to</th>
                            <th><span className="nobr">Order Total</span></th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderList && orderList.length !== 0 ?
                            <>
                              {orderList.map((data) =>
                                <tr className="first odd">
                                  <td>{data.id}</td>
                                  <td>{data.get('createdAt').getDate()}/{data.get('createdAt').getMonth() + 1}/{data.get('createdAt').getFullYear()}</td>
                                  <td>{data.get('user').get('username')}</td>
                                  <td><span className="price">{currencySign} {data.get("amount")}</span></td>
                                  <td><em>{data.get("status")}</em></td>
                                  <td><em>{data.get("paymentStatus")}</em></td>
                                </tr>
                              )}
                            </>
                            : loader ? LoaderSet() : <h4>Sorry Your Order List is Empty</h4>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="box-account">
                    <div className="page-title">
                      <h2>Account Information</h2>
                    </div>
                    <div className="col2-set">
                      <div className="col-1">
                        <h6>Contact Information</h6>
                        <Link to="/userinformation">Edit</Link>
                        <p> {custmerName && custmerName.get('username')}<br />
                          {custmerName && custmerName.get('email')}<br />
                          <Link to="/confirmemail">Change Password</Link> </p>
                      </div>
                      <div className="col-2">
                        <h4>Primary Shipping Address</h4>
                        {custmerName && custmerName.get('address').id !== "undefined" ?
                          <>
                            {(gettingData && gettingData.get('city')) && (gettingData && gettingData.get('province')) ?
                              <address>
                                {checkAddress && checkAddress.get('first_name')} {checkAddress && checkAddress.get('last_name')} <br />
                                {gettingData && gettingData.get('city').get('cityName')} <br />
                                {gettingData && gettingData.get('address')}<br />
                                {gettingData && gettingData.get('province').get('state')}<br />
                                {gettingData && gettingData.get('zipCode')} <br />
                                <Link to={`/billingaddress/${custmerName && custmerName.id}`}>Edit Address</Link>
                              </address>
                              :
                              <address>
                                {checkAddress && checkAddress.get('first_name')} {checkAddress && checkAddress.get('last_name')} <br />
                                {gettingData && gettingData.get('address')}<br />
                                {gettingData && gettingData.get('country').get('name')}<br />
                                {gettingData && gettingData.get('zipCode')} <br />
                                <Link to={`/billingaddress/${custmerName && custmerName.id}`}>Edit Address</Link>
                              </address>
                            }
                          </>
                          :
                          <div>
                            <h5>Your Address Not Found</h5>
                            <button type="button" className=" button add_billing_address">
                              <Link to={`/addbillingaddress/${custmerName && custmerName.id}`} style={{ color: 'black' }}>
                                <span>Add New </span>
                              </Link>
                            </button>

                          </div>
                        }
                      </div>
                    </div>
                  </div>
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
                    <li className="current"><Link>My Dashboard</Link></li>
                    <li><Link to="/userinformation">Account Information</Link></li>
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
        </div> : RoutingHistory.push('/')}
      </section>

    </>
  )
}

export default Dashboard;