import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Parse } from "parse";
import { wishContext } from '../../contextapi/WishListContext';
import { CartContext } from '../../contextapi/context_cart';
import ModalCart from "../../Components/CartModal/ModalCart";
import { Modal } from 'react-bootstrap';
import { LoginContext } from '../../contextapi/LoginContext';


const WishList = () => {
  const { wish, removeToWish } = useContext(wishContext)
  const { removeItem } = useContext(CartContext);
  const { addToCart, item } = useContext(CartContext);
  const { custmerName } = useContext(LoginContext)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [cartModalProp, setcartModalProp] = useState('');
  const [currencySign, setCurrencySign] = useState();
  const [quickViewProp, setQuickViewProp] = useState('');
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    console.log('pathname: ', pathname)

    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });
  }, []);
  const handle = (id, AddtoCart) => {
    const Details = Parse.Object.extend('Products')
    const query = new Parse.Query(Details);
    query.include('image');
    // setForUse(item[item_id)
    query.get(id).then(
      (result) => {
        let imgUrlSrc = '';
        if (result.get('imageUrl')) {
          imgUrlSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + result.get("imageUrl")
        }
        else {
          imgUrlSrc = result.get("image").get("featuredImage")._url
          // imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
        }
        const currentAddedItem = item.find(product => product.id === id);

        const obj = {
          id: result.id,
          name: result.get('name'),
          img: imgUrlSrc,
          dbQuantity: result.get('qty'),
          price: result.get('suggestedRetailPrice')
        }
        if (AddtoCart) {
          // if item exists in cart, must check available quantity in db 
          if (currentAddedItem) {
            if (currentAddedItem.qty < currentAddedItem.dbQuantity) {
              addToCart(obj)
            }
          }
          // else item not in cart then add to
          else {
            addToCart(obj)
          }
        }
      }
    )
  }
  const handleAddAllToCart = (wishListItems) => {

    for (let i = 0; i <= (wishListItems.length - 1); i++) {
      let qty = wishListItems[i].dbQuantity
      if (qty > 0) {
        addToCart(wishListItems[i])
      }
    }
  }

  const handleQuick = (id) => {
    setShow(true)
    setQuickViewProp(id)
  }

  const handleAllCartModel = (wish) => {
    handleAddAllToCart(wish)
    setShow(true)
    setQuickViewProp(wish)
  }
  return (
    <>
      <div>
        <Modal size='lg' className="view_cart" animation={false} show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            The following items has been added to your cart:
          </Modal.Header>
          <Modal.Body>
            <ModalCart id={cartModalProp} />
          </Modal.Body>
        </Modal>
      </div>
      <section className="main-container col2-right-layout">
        <div className="main container">
          <div className="row">
            <div className="col-main col-sm-9 col-xs-12">
              <div className="my-account">
                <div className="page-title">
                  <h2>My Wishlist</h2>
                </div>
                <div className="wishlist-item table-responsive">
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
                          }}>X</td>
                          <td className="th-product"><img src={data.img} alt="cart" /></td>
                          <td className="th-details"><p>{data.name}</p></td>
                          <td className="th-price">{currencySign} {data.price}</td>
                          {data.dbQuantity > 0 ?
                            <th className="td-add-to-cart" onClick={() => {
                              handle(data.id, true)
                              handleQuick(data.id, true)
                            }
                            }><button> Add to Cart</button></th>
                            :
                            <th className="td-add-to-cart disabled pointer_none"><button> Add to Cart</button></th>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="all-cart" onClick={() => handleAllCartModel(wish)}>Add all to cart</button> </div>
              </div>
            </div>
            <aside className="right sidebar col-sm-3 col-xs-12">
              {custmerName && custmerName.get('username') ? <div className="sidebar-account block">
                <div className="sidebar-bar-title">
                  <h3>My Account</h3>
                </div>
                <div className="block-content">
                  <ul>
                    <li><Link to="/dashboard">My Dashboard</Link></li>
                    <li><Link to="/userinformation">Account Information</Link></li>
                    <li><Link to="/orderlist">My Orders</Link></li>
                    {/* <li><Link to="/billingaddress">Billing Address</Link></li>  */}
                    <li className="current"><Link>My Wishlist</Link></li>
                  </ul>
                </div>
              </div> : ''}
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
        </div>
      </section>
    </>
  )
}

export default WishList;