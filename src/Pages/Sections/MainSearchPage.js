import React, { useState, useEffect, useContext } from "react";
import { Parse } from "parse";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Pagination from '../../Components/PagePagination/Pagination';
import { CartContext } from '../../contextapi/context_cart';
import { wishContext } from '../../contextapi/WishListContext';
import { compareContext } from '../../contextapi/CompareListContext';
import { Button, Modal } from 'react-bootstrap';
import { LoaderSet } from '../../ParseConfig'
import QuickView from '../Sections/QuickView';
import ModalCart from "../../Components/CartModal/ModalCart";
import {getProductImageByName} from '../../Components/utils/ProductImage';

const MainSearchPage = () => {
  const { name } = useParams();
  const [sellingcard, setSellingCard] = useState([]);
  const [currencySign, setCurrencySign] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setpostsPerPage] = useState(3);
  const [Rating, setRatings] = useState();
  const [quickViewShow, setquickViewShow] = useState(false);
  const handleClose = () => setShow(false);
  const [quickViewProp] = useState('');
  const handleCloseQuickView = () => setquickViewShow(false);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(true);
  const [cartModalProp, setcartModalProp] = useState('');
  const [isDataUpdated, setIsDataUpdated] = useState(false);


  const {item,addToCart } = useContext(CartContext)
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
  useEffect(() => {

    var ratingResultId;
    const Products = Parse.Object.extend("Products");
    const query = new Parse.Query(Products);
    query.include('image')
    query.matches("name", name, "i");
    query.equalTo("isVisible", true)
    query.limit(6)
    query.find().then(
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
        setIsDataUpdated(true);
        setLoader(false)
      },
      (error) => {
        console.error("error while fetching products for MainSearchPage: ", error);
      }
    );

    const Extras = Parse.Object.extend('Extras');
    const extra = new Parse.Query(Extras);
    extra.limit(1);
    extra.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });
  }, [name, isDataUpdated])

  const IndexOfLastPost = currentPage * postsPerPage;
  const IndexOfFirstPost = IndexOfLastPost - postsPerPage;
  const currentPosts = sellingcard.slice(IndexOfFirstPost, IndexOfLastPost)
  const paginate = pageNumber => setCurrentPage(pageNumber);


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
  const handleModal = (id) => {
    setcartModalProp(id);
    setShow(true)
  }
  return (
    <>
      {/* model for quick view */}
      <div>
        <Modal size='lg' animation={false} show={quickViewShow} onHide={handleCloseQuickView}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body><QuickView id={quickViewProp} /></Modal.Body>
        </Modal>
        {/* model for add to cart */}
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
      </div>

      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            {/* <div className="col-xs-12">
              <ul>
                <li className="home"> <Link title="Go to Home Page" to="/">Home</Link><span>&raquo;</span></li>
                <li className=""> <Link title="Go to Home Page" to="/shop_grid">Smartphone</Link><span>&raquo;</span></li>
                <li><strong>iPhone 6</strong></li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>

      <div className="main-container col2-left-layout">
        <div className="container">
          <div className="row">
            <div className="col-main col-sm-9 col-xs-12 col-sm-push-3">
              <div className="category-description std">
                <div className="slider-items-products">
                  <div id="category-desc-slider" className="product-flexslider hidden-buttons">
                    <div className="slider-items slider-width-col1 owl-carousel owl-Template">


                      <div className="item"> <Link href="#x"><img alt="Products" src="images/cat-slider-img1.jpg" /></Link>
                        <div className="inner-info">
                          <div className="cat-img-title"> <span>Best Product 2017</span>
                            <h2 className="cat-heading">Best Selling Brand</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                            <Link className="info" href="#">Shop Now</Link> </div>
                        </div>
                      </div>

                      <div className="item"> <Link href="#x"><img alt="Products" src="images/cat-slider-img2.jpg" /></Link> </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shop-inner">
                <div className="page-title">
                  {/* <h2>{headerName && headerName[0].get('name')}</h2> */}
                </div>
                <div className="toolbar">
                  <div className="view-mode">
                    <ul>
                      <li className="active"> <Link> <i className="fa fa-th-large"></i> </Link> </li>
                      <li> <Link> <i className="fa fa-th-list"></i> </Link> </li>
                    </ul>
                  </div>
                  <div className="sorter">
                    {/* <div className="short-by">
                      <label>Sort By:</label>
                      <select onChange ={(e) => setCurrentPage(e.target.value)} value={productSort}>
                        <option value="position" selected="selected">Position</option>
                        <option >Name</option>
                        <option value="price">Price</option>
                        <option>Size</option> 
                      </select>
                    </div> */}
                    <div className="short-by page">
                      <label>Show:</label>
                      <select onChange={(e) => setpostsPerPage(e.target.value)} value={postsPerPage}>
                        <option selected="selected" value='1' >1</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='8'>8</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="product-grid-area">
                  <ul className="products-grid">
                    {sellingcard.length !== 0 ?
                      sellingcard && sellingcard.map((data) => {
                        let StocIn = data.get('qty')
                        if (data.get('name')) {
                         const imgSrc = getProductImageByName(data);
                          return (
                            <li className="item col-lg-4 col-md-4 col-sm-6 col-xs-6 ">
                              <div className="product-item">
                                <div className="item-inner">
                                  <div className="product-thumbnail">
                                    <div className="pr-img-area">
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

                                      <Link title={data.get('name')} to={`/product/${data.get("slug")}`}>
                                        <figure className="search_figure">
                                          <img className="first-img img-fluid" src={imgSrc} alt={'product on sale'} />
                                          <img className="hover-img" src={imgSrc}  alt={data.get('name')} /></figure>
                                      </Link> </div>
                                  </div>
                                  <div className="item-info">
                                    <div className="info-inner">
                                      <div className="item-title"> <Link title={data.get('name')} to={`/product/${data.get("slug")}`}>{data.get('name')} </Link> </div>
                                      <div className="item-content">
                                        {renderRatingStars(data.get('rating'))}
                                        <div className="item-price">
                                          <div className="price-box"> <span className="regular-price"> <span className="price"> {currencySign} {data.get('suggestedRetailPrice')}</span> </span> </div>
                                        </div>
                                        <div className="pro-action">
                                          {
                                            StocIn > 0 ?
                                              <button type="button" className="add-to-cart" onClick={() => {
                                                handle(data.id, false, true)
                                                handleModal(data.id)
                                              }} ><span> Add to Cart</span> </button>
                                              :
                                              <button type="button" className="add-to-cart">
                                                <span> OUT OF STOCK</span> </button>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        }
                      })
                      :
                      loader ? LoaderSet() : <h1>No result found</h1>

                    }
                  </ul>
                </div>
                {/* <Pagination postsPerPage={postsPerPage} totalPosts={sellingcard.length} paginate={paginate}></Pagination> */}
              </div>
            </div>
            {/* <aside className="sidebar col-sm-3 col-xs-12 col-sm-pull-9">
              <div className="block category-sidebar">
                <div className="sidebar-title">
                  <h3>Categories</h3>
                </div>
                <ul className="product-categories">
                  <li className="cat-item current-cat cat-parent"><a href="shop_grid.html">Women</a>
                    <ul className="children">
                      <li className="cat-item cat-parent"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Accessories</a>
                        <ul className="children">
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Dresses</a></li>
                          <li className="cat-item cat-parent"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Handbags</a>
                            <ul className="children">
                              <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Beaded Handbags</a></li>
                              <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Sling bag</a></li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li className="cat-item cat-parent"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Handbags</a>
                        <ul className="children">
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; backpack</a></li>
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Beaded Handbags</a></li>
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Fabric Handbags</a></li>
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Sling bag</a></li>
                        </ul>
                      </li>
                      <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Jewellery</a> </li>
                      <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Swimwear</a> </li>
                    </ul>
                  </li>
                  <li className="cat-item cat-parent"><a href="shop_grid.html">Men</a>
                    <ul className="children">
                      <li className="cat-item cat-parent"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Dresses</a>
                        <ul className="children">
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Casual</a></li>
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Designer</a></li>
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Evening</a></li>
                          <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Hoodies</a></li>
                        </ul>
                      </li>
                      <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Jackets</a> </li>
                      <li className="cat-item"><a href="shop_grid.html"><i className="fa fa-angle-right"></i>&nbsp; Shoes</a> </li>
                    </ul>
                  </li>
                  <li className="cat-item"><a href="shop_grid.html">Electronics</a></li>
                  <li className="cat-item"><a href="shop_grid.html">Furniture</a></li>
                  <li className="cat-item"><a href="shop_grid.html">KItchen</a></li>
                </ul>
              </div>
              <div className="block shop-by-side">
                <div className="sidebar-bar-title">
                  <h3>Shop By</h3>
                </div>
                <div className="block-content">
                  <p className="block-subtitle">Shopping Options</p>
                  <div className="layered-Category">
                    <h2 className="saider-bar-title">Categories</h2>
                    <div className="layered-content">
                      <ul className="check-box-list">
                        <li>
                          <input type="checkbox" id="jtv1" name="jtvc" />
                          <label for="jtv1"> <span className="button"></span> Women<span className="count">(12)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv1" name="jtvc" />
                          <label for="jtv1"> <span className="button"></span> Men<span className="count">(22)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv1" name="jtvc" />
                          <label for="jtv1"> <span className="button"></span> Kids<span className="count">(15)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv1" name="jtvc" />
                          <label for="jtv1"> <span className="button"></span> Accessories<span className="count">(12)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv1" name="jtvc" />
                          <label for="jtv1"> <span className="button"></span> Camera & Photo<span className="count">(12)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv2" name="jtvc" />
                          <label for="jtv2"> <span className="button"></span> Computers<span className="count">(18)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv3" name="jtvc" />
                          <label for="jtv3"> <span className="button"></span> Apple Store<span className="count">(15)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv4" name="jtvc" />
                          <label for="jtv4"> <span className="button"></span> Car Electronic<span className="count">(03)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv5" name="jtvc" />
                          <label for="jtv5"> <span className="button"></span> Accessories<span className="count">(04)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv7" name="jtvc" />
                          <label for="jtv7"> <span className="button"></span> Game & Video<span className="count">(07)</span> </label>
                        </li>
                        <li>
                          <input type="checkbox" id="jtv8" name="jtvc" />
                          <label for="jtv8"> <span className="button"></span> Best selling<span className="count">(05)</span> </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="color-area">
                    <h2 className="saider-bar-title">Color</h2>
                    <div className="color">
                      <ul>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                        <li><a href="#"></a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="size-area">
                    <h2 className="saider-bar-title">Size</h2>
                    <div className="size">
                      <ul>
                        <li><a href="#">S</a></li>
                        <li><a href="#">L</a></li>
                        <li><a href="#">M</a></li>
                        <li><a href="#">XL</a></li>
                        <li><a href="#">XXL</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block product-price-range ">
                <div className="sidebar-bar-title">
                  <h3>Price</h3>
                </div>
                <div className="block-content">
                  <div className="slider-range">
                    <div data-label-reasult="Range:" data-min="0" data-max="500" data-unit="$" className="slider-range-price" data-value-min="50" data-value-max="350"></div>
                    <div className="amount-range-price">Range: $10 - $550</div>
                    <ul className="check-box-list">
                      <li>
                        <input type="checkbox" id="p1" name="cc" />
                        <label for="p1"> <span className="button"></span> $20 - $50<span className="count">(0)</span> </label>
                      </li>
                      <li>
                        <input type="checkbox" id="p2" name="cc" />
                        <label for="p2"> <span className="button"></span> $50 - $100<span className="count">(0)</span> </label>
                      </li>
                      <li>
                        <input type="checkbox" id="p3" name="cc" />
                        <label for="p3"> <span className="button"></span> $100 - $250<span className="count">(0)</span> </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </aside> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default MainSearchPage;