import React, { useState, useEffect, useContext } from "react";
import { Parse } from "parse";
import { SectionCarousel } from "../../Components/carousel/SectionCarousel";
import { Link } from "react-router-dom";
import { CartContext } from '../../contextapi/context_cart';
import { wishContext } from '../../contextapi/WishListContext';
import { compareContext } from '../../contextapi/CompareListContext';
import { Button, Modal } from 'react-bootstrap';
import QuickView from '../Sections/QuickView';
import { notification } from 'antd';
import { LoaderSet } from '../../ParseConfig'
import ModalCart from "../../Components/CartModal/ModalCart";
import {getProductImageByName,getProductImageByID } from '../../Components/utils/ProductImage';

const BestSelling = () => {
  const [bestselling, setBestSelling] = useState([]);
  const [currencySign, setCurrencySign] = useState();
  const [show, setShow] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [quickViewShow, setquickViewShow] = useState(false);
  const [resultFound, setResultFound] = useState(false);
  const [quickViewProp, setQuickViewProp] = useState('');
  const [reviewsRating, setReviewsRating] = useState();
  const [loader, setLoader] = useState(true);
  const [relatedProduct, setRelatedProduct] = useState();
  const [cartModal, setCartModal] = useState(false);
  const [cartModalProp, setcartModalProp] = useState('');
  const handleCloseCartModal = () => setCartModal(false);
  const [sellingcard, setSellingCard] = useState([]);
  const handleCloseQuickView = () => setquickViewShow(false);
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


    const Selling = Parse.Object.extend("Category");
    const selling = new Parse.Query(Selling);
    selling.equalTo("parentCategory", null);
    selling.limit(4);
    selling.find().then(
      (result) => {
        getBestSelling(result[0].id);
        setBestSelling(result);
        setLoader(false)
        setIsDataUpdated(true);
      },
      (error) => {
        console.log("error");
      }
    );
  }, [isDataUpdated]);

  // for toste
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

  const {item, addToCart } = useContext(CartContext)
  const { addToWish } = useContext(wishContext)
  const { addToCompare } = useContext(compareContext)
  const handle = (id, compare, isAddToCart) => {
    const Details = Parse.Object.extend('Products')
    const query = new Parse.Query(Details);
    query.include('image');
    query.equalTo("isVisible", true)
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
          }
          else {
            addToWish(obj)
          }
        }
      }
    )
  }

  const handleQuick = (id) => {
    setquickViewShow(true)
    setQuickViewProp(id)
  }

  const handleModal = (id) => {
    setcartModalProp(id);
    setCartModal(true)
  }

  function getBestSelling(category_id) {
    const Products = Parse.Object.extend("Products");
    const query1 = new Parse.Query(Products);
    const Category = Parse.Object.extend("Category");
    const query2 = new Parse.Query(Category);
    query2.equalTo("objectId", category_id);
    query1.include("image");
    query1.equalTo("isVisible", true);
    query1.limit(5);
    query1.matchesQuery("Category", query2);
    query1.find().then(
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
        setSellingCard(products);
        setIsDataUpdated(true)
      },
      (error) => {
        alert("error message", error.message);
      }
    );
  }

  const renderRatingStars = (rating) => {
    ;
    switch (Math.ceil(rating)) {
      case 0:
        return (
          <div className="rating">
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
          </div>
        )
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

  return (
    <>
      {loader ? LoaderSet() : ''}
      {/* model for quick view */}
      <div>
        <Modal size='lg' animation={false} show={quickViewShow} onHide={handleCloseQuickView}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body><QuickView id={quickViewProp} /></Modal.Body>
        </Modal>
        {/* model for add to cart */}

        <div>
          <Modal size='lg' className="view_cart" animation={false} show={cartModal} onHide={handleCloseCartModal}>
            <Modal.Header closeButton>
              The following items has been added to your cart:
            </Modal.Header>
            <Modal.Body>
              <ModalCart id={cartModalProp} />
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <div className="tab-title text-left">
        <h2 className="home_tab_heading"> Best selling</h2>
        <ul className="nav home-nav-tabs home-product-tabs">
          {bestselling && bestselling.map((data, index) => (
            <li className="" key={index}>
              <Link
                style={{ cursor: "pointer" }}
                data-toggle="tab"
                aria-expanded="false"
                onClick={() => {
                  getBestSelling(data.id)
                  setResultFound(true)
                }}
              >
                {data.get("name")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div id="productTabContent" className="tab-content">
        <div className="tab-pane active in">
          <div>
            {sellingcard && sellingcard.length >= 4 ?
              <SectionCarousel>
                {sellingcard && sellingcard.map((data, index) => {
                  if (data.get('name')) {
                    let StockIn = data.get('qty')
                    const imgSrc = getProductImageByName(data)
                    return (
                      <div className="product-item" key={index}>
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
                              <Link
                                title={data.get("name")}
                                to={`/product/${data.get("slug")}`}
                              >
                                <figure className="img-div">
                                  <img
                                    className="first-img custom-height img-fulid"
                                    src={
                                      imgSrc
                                    }
                                    alt={data.get("name")}
                                  />
                                </figure>
                              </Link>
                            </div>
                            <div className="pr-info-area">
                              <div className="pr-button">
                                <div className="mt-button add_to_wishlist" onClick={() => handle(data.id, false, false)}>
                                  <Link title='Wish List' onClick={() => openToste('wish')}>
                                    <i className="fa fa-heart-o"></i>
                                  </Link>
                                </div>
                                <div className="mt-button add_to_compare" onClick={() => handle(data.id, true, false)}>
                                  <Link title='Compare' onClick={() => openToste()}>
                                    <i className="fa fa-link"></i>
                                  </Link>
                                </div>
                                <div className="mt-button quick-view">
                                  <Link title='Quick View' onClick={() => handleQuick(data.id)}>

                                    <i className="fa fa-search"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="item-info">
                            <div className="info-inner">
                              <div className="item-title">
                                <Link
                                  title={data.get("name")}
                                  to={`/product/${data.get("slug")}`}
                                >
                                  {data.get("name")}
                                </Link>
                              </div>
                              <div className="item-content">
                                {renderRatingStars(data.get('rating'))}
                                <div className="item-price">
                                  <div className="price-box">
                                    <span className="regular-price">
                                      <span className="price">
                                        {currencySign} {data.get("suggestedRetailPrice")}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                {StockIn > 0 ?
                                  <div className="pro-action">
                                    <button type="button" className="add-to-cart" onClick={() => {
                                      handle(data.id, false, true)
                                      handleModal(data.id)
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
                  }
                })}
              </SectionCarousel>
              :
              loader ? LoaderSet() : <h3>No result found</h3>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default BestSelling;
