import React, { useState, useEffect, useContext } from 'react';
import HeaderMobile from '../Components/HeaderComponents/HeaderMobile';
import HeaderNav from '../Components/HeaderComponents/HeaderNav';
import { Link } from 'react-router-dom';
import { Parse } from "parse";
import { CartContext } from '../contextapi/context_cart';
// import { wishContext } from '../contextapi/WishListContext';
import { LoginContext } from '../contextapi/LoginContext';
import { notification } from 'antd';
import $ from 'jquery';
import RoutingHistory from '../RoutingHistory';
import Autocomplete from 'react-autocomplete';

const Header = () => {
  const { item, removeItem } = useContext(CartContext);
  // const { wish } = useContext(wishContext);
  const { custmerName, addUserName } = useContext(LoginContext)
  const [hintData, setHintData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [currencySign, setCurrencySign] = useState();
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0)
  const cartCounter = item.reduce((total, curr) => (total + curr.qty), 0);
  // const wishListCounter = wish.reduce((total, curr) => (total + curr.qty), 0);

  useEffect(() => {

    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });

    // event listener to show/hide search dropdown
    document.addEventListener('click', handleSearchDivOnClick, true);
    // event listener to show/hide search dropdown on keypress
    document.addEventListener('keyup', handleSearchDivOnKeyPress, true);


    var Products = Parse.Object.extend('Products');
    var queryName = new Parse.Query(Products);
    // query.matches("name", ".*"+ $scope.searchText +".*",'i');

    queryName.matches("name", ".*" + searchValue && searchValue + ".*", 'i');
    // queryName.matches("name", ".*" + searchValue && searchValue + ".*", 'b');
    // queryName.matches("name", ".*" + searchValue && searchValue + ".*", 'b');
    // var querymodel = new Parse.Query('Products');
    // querymodel.matches("model_number", ".*" + searchValue && searchValue + ".*", 'i',+ ".*", 'b');
    // var querySku = new Parse.Query('Products');
    // querySku.matches("sku", ".*" + searchValue && searchValue + ".*", 'i',+ ".*", 'b');
    // var mainQuery = Parse.Query.or(queryName)
    queryName.include('product_image')
    queryName.equalTo("isVisible", true);
    queryName.limit(10)
    queryName.find().then(
      (result) => {
        setSearchData(result)
        setHintData(result && result.map((data) => data.get('name')));
      },
      (error) => {
        console.log("error");
      }
    );
  }, [searchValue]);


  const handleSearchDivOnClick = (event) => {
    const searchInput = document.querySelector('#searchInput');
    const clickedElement = event.target.id
    if (searchInput.getAttribute('data-value') !== clickedElement) {
      $(".search_dropdown").css("display", "none");
    }
    else {
      $(".search_dropdown").css("display", "block");
    }
  };

  const handleSearchDivOnKeyPress = (event) => {
    const searchInput = document.querySelector('#searchInput')
    // const searchDiv = document.querySelector('.search_dropdown');
    if (searchInput.getAttribute('data-value') === "") {
      $(".search_dropdown").css("display", "none");
    }
    else {
      $(".search_dropdown").css("display", "block");
    }
  }

  // const handle = async (e) => {
  //   e.stopPropagation();

  //   const dataValue = e.target.value
  //   // setSearchText()
  //   setSearchValue(dataValue)
  //   // let dataValue = a.toLowerCase()
  //   if (dataValue.length > 0) {
  //     var Products = Parse.Object.extend('Products');
  //     var queryName = new Parse.Query(Products);
  //     queryName.matches("name", ".*" + dataValue + ".*", 'i');
  //     var querymodel = new Parse.Query('Products');
  //     querymodel.matches("model_number", ".*" + dataValue + ".*", 'i');
  //     var querySku = new Parse.Query('Products');
  //     querySku.matches("sku", ".*" + dataValue + ".*", 'i');

  //     var mainQuery = Parse.Query.or(queryName, querySku, querymodel)
  //     mainQuery.include('product_image')
  //     mainQuery.equalTo("isVisible", true);
  //     mainQuery.limit(10)
  //     mainQuery.find().then(
  //       (result) => {
  //         setSearchData(result)
  //         setHintData(result && result.map((data) => data.get('name')));
  //       },
  //       (error) => {
  //         console.log("error");
  //       }
  //     );
  //   }
  //   else {
  //     setSearchData()
  //   }
  // }

  // TODO: store user in session. Error while login so far
  const handleLogOut = () => {
    addUserName('');
    Parse.User.logOut();
  }

  const Toste = () => {
    notification.error({
      message: 'You do not have any product in your cart.'
    });
  }

  const SearchData = (e) => {
    let value = searchValue && searchValue
    RoutingHistory.push(`/searchPage/${value}`)
    e.preventDefault()
  }

  const capitalize = (sentence) => {
    const words = sentence.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    console.log('Words: ', words)
  }

  const handleSearchChange = (searchVal) => {
    // capitalize(searchVal  )
    const element = document.querySelector('.search_dropdown');
    if (element.style.display = 'block') {
      // console.log('childElementCount: ', element.childElementCount);
      if (element.childElementCount > 0) {
        let children = element.children;
        for (let i = 0; i < children.length; i++) {
          let childText = children[i].innerText;
          // string matches if result equals 0
          // searchVal = searchVal.toLowerCase();
          let searchCaptilize = searchVal.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase())
          if (childText.includes(searchCaptilize)) {
            const boldText = `<b>${searchCaptilize}</b>`;
            children[i].innerHTML = childText.replace(searchCaptilize, boldText);
            // console.log(`childText: ${children[i].innerText}`);
          }
        }
      }
    }
    // console.log('element: ', element);
    setSearchValue(searchVal);
  }
  // const handleKey = (e) => {

  //   if (e.keyCode === 13) {
  //     let value = searchValue
  //     RoutingHistory.push(`/searchPage/${value}`)
  //     e.preventDefault()
  //   }
  //   else {
  //     if (e.keyCode === 40) {
  //       console.log("Down Key is press")
  //       console.log("Search Value is", searchValue)
  //       console.log("Search Data is", searchData)
  //       if (searchValue === searchData) {
  //         console.log("This is equal")
  //       }
  //       let downPress = activeOption && activeOption
  //       if (downPress - 1 === searchData && searchData.length) {
  //         return
  //       }
  //       downPress = downPress + 1;
  //     }
  //     else {
  //       if (e.keyCode === 38) {
  //         console.log("Up Key is press")
  //         //  let upPress = searchValue && searchValue
  //         //  if(upPress === 0){
  //         //    return
  //         //  }
  //         //  upPress = upPress - 1;
  //       }
  //     }
  //   }
  // }

  const handleCheckOut = () => {
    if (subTotal !== 0) {
      return (
        <div className="actions">
          {custmerName && custmerName.get('username') ?
            <Link to="/shippinginfo">
              <button className="btn-checkout" type="button">
                <i className="fa fa-check"></i>
                <span>Checkout</span>
              </button>
            </Link>
            : <Link to="/checkout">
              <button className="btn-checkout" type="button">
                <i className="fa fa-check"></i>
                <span>Checkout</span>
              </button>
            </Link>}
          <Link to="/viewcart">
            <button className="view-cart" type="button">
              <i className="fa fa-shopping-cart"></i>
              <span>View Cart</span>
            </button>
          </Link>
        </div>
      )
    }
    else {
      return (
        <div className="actions">
          {custmerName && custmerName.get('username') ?
            <button className="btn-checkout" type="button" onClick={() => Toste()}>
              <i className="fa fa-check"></i>
              <span>Checkout</span>
            </button>
            :
            <button className="btn-checkout" type="button" onClick={() => Toste()}>
              <i className="fa fa-check"></i>
              <span>Checkout</span>
            </button>
          }

          <button className="view-cart" type="button" onClick={() => Toste()}>
            <i className="fa fa-shopping-cart"></i>
            <span>View Cart</span>
          </button>
        </div>
      )
    }
  }

  const headerCheckout = () => {
    if (subTotal !== 0) {
      return (
        <li><Link title="Checkout" to="/checkout"><span>Checkout</span></Link></li>
      )
    }
    else {
      return (
        // <li><Link title="Checkout" onClick = {() => Toste()}><span>Checkout</span></Link></li>
        <li> <Link title="Checkout" onClick={() => Toste()}><span>Checkout</span></Link></li>
      )
    }
  }
  return (
    <>
      <HeaderMobile />
      <header>
        <div className="header-container">
          <div className="header-top">
            <div className="container">
              <div className="row">
                <div className="col-sm-4 col-md-4 col-xs-12">
                  {/* <!-- Default Welcome Message --> */}
                  <div className="welcome-msg hidden-xs hidden-sm">{custmerName && custmerName.get('username')} </div>
                  {/* <!-- Language &amp; Currency wrapper --> */}
                  {/* <div className="language-currency-wrapper">
                      <div className="inner-cl">
                        <div className="block block-language form-language">
                          <div className="lg-cur"><span><img src="images/flag-default.jpg" alt="French" /><span className="lg-fr">French</span><i className="fa fa-angle-down"></i></span></div>
                          <ul>
                            <li><a className="selected" href="#"><img src="images/flag-english.jpg" alt="english" /><span>English</span></a></li>
                            <li><a href="#"><img src="images/flag-default.jpg" alt="French" /><span>French</span></a></li>
                            <li><a href="#"><img src="images/flag-german.jpg" alt="German" /><span>German</span></a></li>
                            <li><a href="#"><img src="images/flag-brazil.jpg" alt="Brazil" /><span>Brazil</span></a></li>
                            <li><a href="#"><img src="images/flag-chile.jpg" alt="Chile" /><span>Chile</span></a></li>
                            <li><a href="#"><img src="images/flag-spain.jpg" alt="Spain" /><span>Spain</span></a></li>
                          </ul>
                        </div>
                        <div className="block block-currency">
                          <div className="item-cur"><span>USD</span><i className="fa fa-angle-down"></i></div>
                          <ul>
                            <li><a href="#"><span className="cur_icon">€</span>EUR</a></li>
                            <li><a href="#"><span className="cur_icon">¥</span>JPY</a></li>
                            <li><a className="selected" href="#"><span className="cur_icon">$</span>USD</a></li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
                </div>

                {/* <!-- top links --> */}
                <div className="headerlinkmenu col-md-8 col-sm-8 col-xs-12"> <span className="phone  hidden-xs hidden-sm">Call Us: +123.456.789</span>
                  <ul className="links">
                    <li className="hidden-xs"><Link title="Help Center" to="/"><span>Help Center</span></Link></li>
                    <li><Link title="Store Locator" to="/"><span>Store Locator</span></Link></li>
                    {headerCheckout()}
                    {custmerName && custmerName.get('username') ?
                      <>
                        <li>
                          <div className="dropdown"><Link className="current-open" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><span>My Account</span> <i className="fa fa-angle-down"></i></Link>
                            <ul className="dropdown-menu" role="menu">
                              <li><Link to="/dashboard">Dashboard</Link></li>
                              <li><Link to="/wishlist">Wishlist</Link></li>
                              {/* <li><Link href="orders_list.html">Order Tracking</Link></li> */}
                              <li><Link to="/aboutus">About us</Link></li>
                            </ul>
                          </div>
                        </li>
                        <li ><Link onClick={handleLogOut} to='/'>Log Out</Link></li>
                      </>
                      : <li><Link title="login" to="/account"><span>Login</span></Link></li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- header inner --> */}
          <div className="header-inner">
            <div className="container">
              <div className="row">
                <div className="col-sm-3 col-md-2 col-xs-12 jtv-logo-block">
                  {/* <!-- Header Logo --> */}
                  <div className="logo">
                    <Link title="e-commerce" to="/">
                      <img alt="ShopMart" title="ShopMart" src="https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/fbf9c5e84ff2d76b426b93935a68a4b4_logo.png" />
                    </Link>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-5 col-md-6 jtv-top-search">
                  {/* <!-- Search --> */}
                  <div className="top-search">
                    <div id="search">
                      <form onSubmit={(e) => SearchData(e)}>
                        {/* <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your search..."
                            name="search"
                            id="searchInput"
                            value={searchValue && searchValue}
                            onChange={handle}
                          />
                          <Link onClick={() => setSearchData('')} to={`/searchPage/${searchValue}`}>
                          <Link to={`/searchPage/${searchValue}`}>
                            <button className="btn-search" type="button">
                              <i className="fa fa-search"></i>
                            </button>
                          </Link>
                        </div>
                        <ul className="search_dropdown" >
                          {searchData && searchData.map((data, index) => (
                            <>
                              <Link onClick={() => setSearchData('')} to={`/searchPage/${data.get('name')}`}>
                                <li className='search-list'>{data.get('name')}</li>
                            { index  === activeOption ?
                              <Link onClick={() => setSearchData('')} to={`/searchPage/${data.get('slug')}`}>
                                <li key={data.get('name')} className='search-list'>{data.get('name')}</li>
                              </Link>
                              : null }
                            </>
                          ))}
                        </ul> */}
                        <div className="autocomplete-wrapper" id='searchInput' data-value={searchValue}>
                          <Autocomplete
                            id="auto-complete-input"
                            value={searchValue && searchValue}
                            items={searchData && searchData}
                            getItemValue={item => item.get('name')}
                            shouldItemRender={item => item.get('name')}
                            renderMenu={item => (
                              <div className="search_dropdown">
                                {item}
                              </div>
                            )}
                            renderItem={(item, isHighlighted) =>
                              <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                                {item.get('name')}
                              </div>
                            }
                            onChange={(event, val) => handleSearchChange(val)}
                            onSelect={val => setSearchValue(val)}
                          />
                          {searchValue && searchValue ?
                            <Link to={`/searchPage/${searchValue}`}>
                              <button className="btn-search" type="button">
                                <i className="fa fa-search"></i>
                              </button>
                            </Link>
                            : <button className="btn-search" type="button">
                              <i className="fa fa-search"></i>
                            </button>
                          }
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* <!-- End Search -->  */}
                </div>
                <div className="col-xs-12 col-sm-4 col-md-4 top-cart">
                  <div className="link-wishlist">
                    <div className="mini-cart">
                      <div className="basket">
                        <div className="cart-icon">
                          <i className="icon-heart icons"></i>
                          {/* <span className="cart-total">{wishListCounter}</span> */}
                        </div>
                        <Link to="/wishlist">
                          <span> Wishlist</span>
                        </Link>

                      </div>
                    </div>
                  </div>
                  <div className="link-wishlist">
                    <div className="mini-cart">
                      <div className="basket">
                        <div className="cart-icon">
                          <i className="fa fa-link"></i>
                          {/* <span className="cart-total">{wishListCounter}</span> */}
                        </div>
                        <Link to="/compare">
                          <span> Comparelist</span>
                        </Link>

                      </div>
                    </div>
                  </div>
                  {/* <!-- top cart --> */}
                  <div className="top-cart-contain">
                    <div className="mini-cart">
                      <div
                        data-toggle="dropdown"
                        data-hover="dropdown"
                        className="basket dropdown-toggle"
                      >
                        <span>
                          <div className="cart-icon">
                            <i className="icon-basket-loaded icons"></i>
                            <span className="cart-total">{cartCounter}</span>
                          </div>
                          <div className="shoppingcart-inner hidden-xs">
                            <span className="cart-title">My Cart</span>
                          </div>
                        </span>
                      </div>
                      <div>
                        <div className="top-cart-content">
                          <div className="block-subtitle hidden">
                            Recently added items
                              </div>
                          <ul
                            id="cart-sidebar"
                            className="mini-products-list"
                          >
                            {item && item.map((data) => (
                              <li className="item odd">
                                <Link
                                  title={data.name}
                                  className="product-image"
                                >
                                  <img
                                    src={
                                      data.img
                                    }
                                    alt={data.name}
                                    width="65"
                                  />
                                </Link>
                                <div className="product-details">
                                  <Link

                                    title="Remove This Item"
                                    className="remove-cart"
                                    onClick={() => {
                                      removeItem(data.id)
                                    }}
                                  >
                                    <i className="pe-7s-trash"></i>
                                  </Link>
                                  <p className="product-name">
                                    <Link>
                                      {data.name}
                                    </Link>
                                  </p>
                                  <strong>{data.qty}</strong> x
                                  <span className="price">{currencySign} {data.price}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                          {subTotal === 0 ? <h6 className='text-center'>Your Cart is Empty</h6> :
                            <div className="top-subtotal">
                              Subtotal: {currencySign} {subTotal}  <span className="price"></span>
                            </div>
                          }
                          {handleCheckOut()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="fabs">
        <div className="chat">
          <div className="chat_header">
            <div className="chat_option">
              <div className="header_img">
                <i className="fa fa-user-circle img" aria-hidden="true"></i>
              </div>
              <span id="chat_head">Jane Doe</span> <br /> <span className="agent">Agent</span> <span className="online">(Online)</span>
              <span id="chat_fullscreen_loader" className="chat_fullscreen_loader">
                <i className="fa fa-window-maximize" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div className="chat_body chat_login">
            <a id="chat_first_screen" className="fab">
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <p>We make it simple and seamless for businesses and people to talk to each other. Ask us anything</p>
          </div>
          <div id="chat_converse" className="chat_conversion chat_converse">
            <a id="chat_second_screen" className="fab">
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Hey there! Any question?</span>
            <span className="chat_msg_item chat_msg_item_user">
              Hello!</span>
            <span className="status">20m ago</span>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Hey! Would you like to talk sales, support, or anyone?</span>
            <span className="chat_msg_item chat_msg_item_user">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
            <span className="status2">Just now. Not seen yet</span>
          </div>
          <div id="chat_body" className="chat_body">
            <div className="chat_category">
              <a id="chat_third_screen" className="fab">
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </a>
              <p>What would you like to talk about?</p>
              <ul>
                <li>Tech</li>
                <li className="active">Sales</li>
                <li >Pricing</li>
                <li>other</li>
              </ul>
            </div>
          </div>
          <div id="chat_form" className="chat_converse chat_form">
            <a id="chat_fourth_screen" className="fab">
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </a>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Hey there! Any question?</span>
            <span className="chat_msg_item chat_msg_item_user">
              Hello!</span>
            <span className="status">20m ago</span>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Agent typically replies in a few hours. Don't miss their reply.
            <div>
                <br />
                <form className="get-notified">
                  <label for="chat_log_email">Get notified by email</label>
                  <input id="chat_log_email" placeholder="Enter your email" />
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                </form>
              </div>
            </span>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Send message to agent.
            <div>
                <form className="message_form">
                  <input placeholder="Your email" />
                  <input placeholder="Technical issue" />
                  <textarea rows="4" placeholder="Your message"></textarea>
                  <button>Send</button>
                </form>
              </div>
            </span>
          </div>
          <div id="chat_fullscreen" className="chat_conversion chat_converse">
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Hey there! Any question?</span>
            <span className="chat_msg_item chat_msg_item_user">
              Hello!</span>
            <div className="status">20m ago</div>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Hey! Would you like to talk sales, support, or anyone?</span>
            <span className="chat_msg_item chat_msg_item_user">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
            <span className="chat_msg_item chat_msg_item_user">
              Where can I get some?</span>
            <span className="chat_msg_item chat_msg_item_admin">
              <div className="chat_avatar">
                <img />
              </div>The standard chuck...</span>
            <span className="chat_msg_item chat_msg_item_user">
              There are many variations of passages of Lorem Ipsum available</span>
            <div className="status2">Just now, Not seen yet</div>
            <span className="chat_msg_item ">
              <ul className="tags">
                <li>Hats</li>
                <li>T-Shirts</li>
                <li>Pants</li>
              </ul>
            </span>
          </div>
          <div className="fab_field">
            <a id="fab_camera" className="fab">
              <i className="fa fa-camera" aria-hidden="true"></i>
            </a>
            <a id="fab_send" className="fab">
              <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </a>
            <textarea id="chatSend" name="chat_message" placeholder="Send a message" className="chat_field chat_message"></textarea>
          </div>
        </div>
        <a id="prime" className="fab">
          <i className="fa fa-comment-o prime" aria-hidden="true"></i>
        </a>
      </div>
      <HeaderNav />
    </>
  )
}
export default Header;