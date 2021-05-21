import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contextapi/context_cart';
import { Parse } from "parse";
import { Button } from 'react-bootstrap';
import { wishContext } from '../../contextapi/WishListContext';
import { compareContext } from '../../contextapi/CompareListContext';
import { notification } from 'antd';
import RoutingHistory from '../../RoutingHistory';
import { SectionCarousel } from '../../Components/carousel/SectionCarousel';
import { LoaderSet } from '../../ParseConfig';
import { LoginContext } from '../../contextapi/LoginContext';


const ModalCart = (props) => {
  const [currencySign, setCurrencySign] = useState();
  const [relatedProduct, setRelatedProduct] = useState();
  const [loader, setLoader] = useState(true);
  const { addToWish } = useContext(wishContext);
  const { addToCompare } = useContext(compareContext);
  const { custmerName } = useContext(LoginContext);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  useEffect(() => {

    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });
    const Details = Parse.Object.extend('Products')
    const detailProduct = new Parse.Query(Details);
    detailProduct.include('product_image');
    detailProduct.equalTo("isVisible", true);
    detailProduct.include('Category');
    detailProduct.include('SubCategory');
    detailProduct.include("brands");
    detailProduct.find().then(
      (products) => {
        for (let i = 0; i < products.length; i++) {
          let productId = products[i].id;
          const RelRatings = Parse.Object.extend('Ratings')
          const query = new Parse.Query(RelRatings);
          query.equalTo('product', { "__type": "Pointer", "className": "Products", "objectId": productId && productId });
          query.find().then(
              (reviews) => {
                  let rating = 0;
                  for (let i = 0; i < reviews.length; i++) {
                      rating += reviews[i].get('qualityRating');
                  }
                  products[i].set('rating', (rating / reviews.length));
              });
      }
        setRelatedProduct(products)
        setIsDataUpdated(true);
        setLoader(false)
      }
    )


  }, [props.id,isDataUpdated ]);

    

  const renderRatingStars = (rating) => {
        switch (Math.ceil(rating)) {
        
            case 1:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 2:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 3:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 4:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
            case 5:
                return (
                    <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                    </div>
                )
            default:
                return (
                    <div className="rating">
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                        <i className="fa fa-star-o"></i>
                    </div>
                )
    }

}

  //for toste 
  const openToste = (data) => {
    if (data === 'wish') {
      notification.success({
        message: 'Item added to your Wishlist ',
      });
    }
    else {
      notification.success({
        message: 'Item added to Compare list ',
      });
    }
  };

  const Toste = () => {
    notification.error({
      message: 'You do not have any product in your cart.'
    });
  }

  const handleProceedCheckOut = () => {
    if (subTotal !== 0) {
      return (
        custmerName && custmerName.get('username') ?
          <Link to='/shippinginfo'>
            <button type="button" className=" button pro-add-to-cart">
              <span>Proceed to Checkout</span>
            </button>
          </Link>
          : <Link to='/checkout'>
            <button type="button" className=" button pro-add-to-cart">
              <span>Proceed to Checkout</span>
            </button>
          </Link>

      )
    }
    else {
      return (
        custmerName && custmerName.get('username') ?
          <Link onClick={() => Toste()}>
            <button type="button" className=" button pro-add-to-cart">
              <span>Proceed to Checkout</span>
            </button>
          </Link>
          : <Link onClick={() => Toste()}>
            <button type="button" className=" button pro-add-to-cart">
              <span>Proceed to Checkout</span>
            </button>
          </Link>
      )
    }
  }


  const { item, addToCart, incrementItem, removeItem, decrementItem } = useContext(CartContext);
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);

  //context api  
  const handle = (id , compare, isAddToCart, isBuyNow = false) => {
    console.log('modal adToCart...')
    const Details = Parse.Object.extend('Products')
    const query = new Parse.Query(Details);
    query.include('image');
    query.get(id).then(
      (result) => {
        let imgUrlSrc = '';
        if (result.get('imageUrl')) {
          imgUrlSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + result.get("imageUrl")
        }
        else {
          if (result.get("image").get("featuredImage")) {
            imgUrlSrc = result.get("image").get("featuredImage")._url
          }
          else {
            imgUrlSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
          }
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
        if (isAddToCart) {
          // if item exists in cart, must check available quantity in db 
          if(currentAddedItem){
            if(currentAddedItem.qty < currentAddedItem.dbQuantity){
            addToCart(obj)
            }
          }
          // else item not in cart then add to
          else{
            addToCart(obj)
          }
        }
        else {
          if (compare) {
            addToCompare(obj)
          } else {
            addToWish(obj)
          }
        }
      }
    )
    if (isBuyNow)
      RoutingHistory.push('/checkout');
  }
  return (
    <div>
      <div className="row">
        <div className="col-sm-4">
          <div className="heading_light">QUICK CART</div>
          <p className="cart_count">{item && item.length} items in your shopping cart</p>
          <div className="row vc_total">
            <div className="col-sm-6">
              <label>
                Total:
                        </label>
            </div>

            <div className="col-sm-6 text-right">
              <label>
                {currencySign} {subTotal}
              </label>
            </div>
          </div>
          <Link to='/'>
            <button type="button" className="button buy_now">
              <span>Continue Shopping</span>
            </button>
          </Link>
          <Link to='/viewcart'>
            <Button variant="default" className=" button buy_now">
              <span>View Cart </span>
            </Button>
          </Link>
          {handleProceedCheckOut()}

        </div>

        <div className="col-sm-8">
          <div className="heading_light">YOUR ORDER</div>
          <div className="">
            <div className="table-responsive">
              <table className="table cart_summary text-center borderless">
                <tbody>
                  {item && item.map((data) => (
                    <tr>
                      <td className="cart_product">
                        <Link >
                          <img src={data.img} alt="Product" />
                        </Link>
                      </td>
                      <td className="cart_description">
                        <p className="product-name">{data.name}</p>
                      </td>
                      <td className="price"><span>{currencySign} {data.price}</span></td>
                      <td className="qty">
                        <div className="numbers-row">
                          <div onClick={() => decrementItem(data.id)} className="dec qtybutton"><i className="fa fa-minus">&nbsp;</i></div>
                          <div className="itemQty">{data.qty}</div>
                          {data.qty < data.dbQuantity ?
                       <div onClick={() => incrementItem(data.id)} className="inc qtybutton"><i className="fa fa-plus">&nbsp;</i></div>
                     :  <div className="inc qtybutton disabled pointer_none"><i className="fa fa-plus">&nbsp;</i></div>}
                       </div>
                      </td>
                      <td className="price"><span>{currencySign} {data.qty * data.price}</span></td>
                        {/* <td className="action"> <i className="icon-close" onClick={() => {
                          removeItem(data.id)
                        }}></i></td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="related-product-area">
            <div className="page-header">
              <h2>You May Like</h2>
            </div>
            <div className="related-products-pro">
              {relatedProduct && relatedProduct.length >= 4 ?
                <SectionCarousel>
                  {relatedProduct && relatedProduct.map((data) => {
                    let StockIn = data.get('count')
                    let imgSrc = '';
                    if (data.get('imageUrl')) {
                      imgSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + data.get("imageUrl")
                    }
                    else {
                      if (data.get("image").get("featuredImage")) {
                          imgSrc = data.get("image").get("featuredImage")._url
                      }
                      else {
                          imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
                      }
                  }
                    return (
                      <div key={data.id} className="product-item">
                        <div className="item-inner">
                          <div className="product-thumbnail">
                            {
                              data.get('isNew') === true
                                ? <div className="icon-new-label new-right">New</div>
                                : null
                            }
                            {
                              data.get('isFeaturedOffer') === true
                                ? <div className="ribbon">Featured</div>
                                : null
                            }
                            {

                              data.get('onSale') === true
                                ? <div className="icon-sale-label sale-right">Sale</div>
                                : null}
                            <div className="pr-img-area">
                              <Link title={data.get("name")} to={`/product/${data.get("slug")}`}>
                                <figure className="img-div">
                                  <img className="first-img" src={imgSrc} />
                                  <img className="hover-img" src={imgSrc} alt=" Related Products" />
                                </figure>
                              </Link>
                            </div>
                            <div className="pr-info-area">
                              <div className="pr-button">
                                <div className="mt-button add_to_wishlist" onClick={() => handle(data.id, false, false, false)}>
                                  <Link title='Wish List' onClick={() => openToste('wish')}>
                                    <i className="fa fa-heart-o"></i>
                                  </Link>
                                </div>
                                <div className="mt-button add_to_compare" onClick={() => handle(data.id, true, false, false)}>
                                  <Link title='Compare' onClick={() => openToste()}>
                                    <i className="fa fa-link"></i>
                                  </Link>
                                </div>
                                <div className="mt-button quick-view">
                                  <Link title='Quick View'
                                  //  onClick={() => handleQuick(data.id)}
                                  >

                                    <i className="fa fa-search"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="item-info">
                            <div className="info-inner">
                              <div className="item-title">
                                <Link title={data.get("name")} to={`/product/${data.get("slug")}`}> {data.get("name")}
                                </Link>
                              </div>
                              <div className="item-content">

                                 {renderRatingStars(data.get('rating'))} 

                                <div className="item-price">
                                  <div className="price-box">
                                    <span className="regular-price">
                                      <span className="price">{currencySign} {data.get("suggestedRetailPrice")}</span>
                                    </span>
                                  </div>
                                </div>
                                {StockIn > 0 ?
                                  <div className="pro-action">
                                    <button type="button" className="add-to-cart" onClick={() => {
                                      handle(data.id, false, true, false)
                                    }}>
                                      <span> Add to Cart</span>
                                    </button>
                                  </div>
                                  :
                                  <div className='disabled'>
                                    <div className="pointer_none">
                                      <div className="pro-action">
                                        <button type="button" className="add-to-cart">
                                          <span> Out of Stock</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </SectionCarousel>
                : loader ? LoaderSet() : <h1>No result found</h1>}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ModalCart;