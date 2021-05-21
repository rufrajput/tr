import React, { useState, useEffect, useContext } from "react";
import { Parse } from "parse";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { CartContext } from '../contextapi/context_cart';
import { wishContext } from '../contextapi/WishListContext';
import { Modal } from 'react-bootstrap';
import QuickView from './Sections/QuickView';
// import Pagination from '../Components/PagePagination/Pagination';
import { compareContext } from "../contextapi/CompareListContext";
import { notification } from 'antd';
import ReactSpinner from 'react-bootstrap-spinner';
import { LoaderSet } from '../ParseConfig'
import ModalCart from '../Components/CartModal/ModalCart';
import {getProductImageByName} from '../Components/utils/ProductImage';

import $ from 'jquery';
const Brands = (props) => {
    const { id } = useParams();
    const [brandProducts, setBrandProducts] = useState([]);
    const [currencySign, setCurrencySign] = useState();
    const [headerName, setHeaderName] = useState();
    const [subCategoryId, setSubCategoryId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setpostsPerPage] = useState(3);
    const [brandsName, setBrandsName] = useState();
    const [Rating, setRatings] = useState();
    const [reviewsRating, setReviewsRating] = useState();
    const [show, setShow] = useState(false);
    const [quickViewShow, setquickViewShow] = useState(false);
    const [quickViewProp, setQuickViewProp] = useState('');
    const [defaultProducts, setDefaultProducts] = useState(false)
    const handleClose = () => setShow(false);
    const handleCloseQuickView = () => setquickViewShow(false);
    const [loader, setLoader] = useState(true);
    const [cartModalProp, setcartModalProp] = useState('');
    const [bestCategory, setBestCategory] = useState([]);
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    useEffect(() => {

        // for header name
        const dataName = Parse.Object.extend('Brands');
        const headName = new Parse.Query(dataName);
        headName.include('brand_image')
        headName.limit(5)
        headName.equalTo('objectId', id)
        headName.find().then((data) => {
            setHeaderName(data)
        }, (error) => {
            console.error('Error while fetching Extras', error);
        });
        // for currency
        const Extras = Parse.Object.extend('Extras');
        const query = new Parse.Query(Extras);
        query.limit(1);
        query.find().then((results) => {
            setCurrencySign(results[0].get("priceSymbol"))
        }, (error) => {
            console.error('Error while fetching Extras', error);
        });

        //get product aginst brands
        const Products = Parse.Object.extend("Products");
        const query1 = new Parse.Query(Products);
        query1.include('brands')
        query1.descending("createdAt");
        query1.ascending('suggestedRetailPrice')
        const Brands = Parse.Object.extend("Brands");
        const query2 = new Parse.Query(Brands);
        query2.equalTo("objectId", id);
        query1.equalTo('isVisible', true)
        query1.include("image");
        query1.limit(12);
        query1.matchesQuery("brands", query2);
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
                setBrandProducts(products);
                setDefaultProducts(products);
                setIsDataUpdated(true)
                setLoader(false)
            },
            (error) => {
                alert("error");
            }
        );

        //get category

        // const Category = Parse.Object.extend("Category");
        // const category = new Parse.Query(Category);
        // category.descending("name");
        // category.limit(20);
        // category.find().then(
        //     (result) => {
        //         setBestCategory(result)
        //         // let ParentCategory = result;
        //         // console.log("Result",ParentCategory)
        //         // const ParentCategory = Parse.Object.extend("Category");
        //         // const parentcategory = new Parse.Query(ParentCategory);
        //         // parentcategory.equalTo('parentCategory' , null)
        //         // ParentCategory.find().then((cat)=>{
        //         //     let ParentCategoryID =  cat.id
        //         //     console.log("Parent Category ", ParentCategoryID)
        //         //     setBestCategory(cat)

        //         // })
        //         // // setBestCategory(result);

        //     },
        //     (error) => {
        //         console.error("error while fetching data for SideMenu", error);
        //     }
        // );

        //for get product aginest subcategory

        // const Products = Parse.Object.extend("Products");
        // const query1 = new Parse.Query(Products);
        // const Category = Parse.Object.extend("Category");
        // const query2 = new Parse.Query(Category);

        // query2.equalTo("objectId", 'XEzx7D94i5');
        // query1.include("image");
        // query1.equalTo("isVisible", true);
        // query1.limit(5);
        // query1.matchesQuery("Category", query2);
        // query1.find().then(
        //     (results) => {
        //         console.log('reuslt data is :', results)
        //         setSellingCard(results);
        //         setDefaultProducts(results);
        //         setLoader(false)
        //     },
        //     (error) => {
        //         alert("error");
        //     }
        // );
        //for brands
        // const Brands = Parse.Object.extend("Brands");
        // const querybrand = new Parse.Query(Brands);
        // querybrand.find().then(
        //     (results) => {
        //         setBrandsName(results);
        //         setLoader(false)
        //     },
        //     (error) => {
        //         alert("error");
        //     }
        // );
        Parse.Cloud.run('categoriesWithSubCategories').then(function (results) {
            setBestCategory(results)
        });
    }, [id,isDataUpdated]);

    // Page Pagination
    // const IndexOfLastPost = currentPage * postsPerPage;
    // const IndexOfFirstPost = IndexOfLastPost - postsPerPage;
    // const currentPosts = sellingcard.slice(IndexOfFirstPost, IndexOfLastPost)
    // const paginate = pageNumber => setCurrentPage(pageNumber);


    // Checkbox selected option
    $("input:checkbox").on('click', function () {
        var $box = $(this);
        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    });

    //for toste alert
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

    // const handlePriceFilter = (greater, less) => {
    //     if (brandId) {
    //         const Products = Parse.Object.extend("Products");
    //         const query1 = new Parse.Query(Products);
    //         query1.include('brands')
    //         query1.descending("createdAt");
    //         query1.ascending('suggestedRetailPrice')
    //         const Brands = Parse.Object.extend("Brands");
    //         const query2 = new Parse.Query(Brands);
    //         query2.equalTo("objectId", brandId);
    //         console.log('greater and less ', greater, less)
    //         query1.equalTo('isVisible', true)
    //         query1.lessThan('suggestedRetailPrice', less)
    //         query1.greaterThanOrEqualTo('suggestedRetailPrice', greater)
    //         query1.include("image");
    //         query1.limit(12);
    //         query1.matchesQuery("brands", query2);
    //         query1.find().then(
    //             (results) => {
    //                 setSellingCard(results);
    //             },
    //             (error) => {
    //                 alert("error");
    //             }
    //         );
    //     }
    //     else {

    //         const Products = Parse.Object.extend("Products");
    //         const query1 = new Parse.Query(Products);
    //         query1.include('brands')
    //         query1.ascending("createdAt");
    //         query1.lessThan('suggestedRetailPrice', less)
    //         query1.greaterThanOrEqualTo('suggestedRetailPrice', greater)
    //         query1.ascending('suggestedRetailPrice')
    //         const Category = Parse.Object.extend("Category");
    //         const query2 = new Parse.Query(Category);
    //         query2.equalTo("objectId", id);
    //         query1.equalTo('isVisible', true)
    //         query1.include("image");
    //         query1.limit(12);
    //         query1.matchesQuery("SubCategory", query2);
    //         query1.find().then(
    //             (results) => {
    //                 setSellingCard(results);
    //             },
    //             (error) => {
    //                 alert("error");
    //             }
    //         );
    //     }
    // }
    // const handleBrand = (id) => {
    //     setBrandId(id)
    //     const Products = Parse.Object.extend("Products");
    //     const query1 = new Parse.Query(Products);
    //     query1.include('brands')
    //     query1.descending("createdAt");
    //     query1.ascending('suggestedRetailPrice')
    //     const Brands = Parse.Object.extend("Brands");
    //     const query2 = new Parse.Query(Brands);
    //     query2.equalTo("objectId", id);
    //     query1.equalTo('isVisible', true)
    //     query1.include("image");
    //     query1.limit(12);
    //     query1.matchesQuery("brands", query2);
    //     query1.find().then(
    //         (results) => {
    //             setSellingCard(results);
    //         },
    //         (error) => {
    //             alert("error");
    //         }
    //     );
    // }
    // const clearAllFilter = (id) => {
    //     if (id) {
    //         handleBrand(id);
    //     }
    //     else {
    //         setSellingCard(defaultProducts);
    //     }
    // }

    // Star Rating 


    const renderRatingStars = (rating) => {
        // handleReviewsRating(id);
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
    const clearAllFilter = (id) => {
        if (id) {
            console.log('in if ')
            handleSubcategoryProd(id);

        }
        else {
            setBrandProducts(defaultProducts);
            console.log('in else ')

        }
    }

    // for  contextApi
    const {item,addToCart } = useContext(CartContext);
    const { addToWish } = useContext(wishContext);
    const { addToCompare } = useContext(compareContext);
    const handle = (id, compare, AddtoCart) => {
        const Details = Parse.Object.extend('Products')
        const query = new Parse.Query(Details);
        query.equalTo("isVisible", true);
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
        setShow(true)
    }


    //get data aginst subcategory
    const handleSubcategoryProd = (subId) => {
        setSubCategoryId(subId)
        const Products = Parse.Object.extend("Products");
        const query = new Parse.Query(Products);
        console.log('id aginst subcategory :', subId)
        query.include("image");
        query.equalTo("brands", { "__type": "Pointer", "className": "Brands", "objectId": id })
        query.equalTo("SubCategory", { "__type": "Pointer", "className": "Category", "objectId": subId })
        query.equalTo("isVisible", true);
        query.limit(12);
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
                setBrandProducts(products);
                setIsDataUpdated(true)
            },
            (error) => {
                alert("error");
            }
        );
    }

    //price felter
    const handlePriceFilter = (greater, less) => {
        if (subCategoryId) {
            const Products = Parse.Object.extend("Products");
            const query1 = new Parse.Query(Products);
            query1.include("image");
            query1.descending("createdAt");
            query1.ascending('suggestedRetailPrice')
            query1.equalTo("isVisible", true);
            query1.lessThan('suggestedRetailPrice', less)
            query1.greaterThanOrEqualTo('suggestedRetailPrice', greater)
            query1.limit(12);
            const Category = Parse.Object.extend("Category");
            const query2 = new Parse.Query(Category);
            query2.equalTo("objectId", subCategoryId);
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
                    setBrandProducts(products);
                    setIsDataUpdated(true)
                },
                (error) => {
                    alert("error");
                }
            );
        }
        else {

            const Products = Parse.Object.extend("Products");
            const query1 = new Parse.Query(Products);
            query1.include('brands')
            query1.descending("createdAt");
            query1.ascending('suggestedRetailPrice')
            const Brands = Parse.Object.extend("Brands");
            const query2 = new Parse.Query(Brands);
            query2.equalTo("objectId", id);
            query1.equalTo('isVisible', true)
            query1.lessThan('suggestedRetailPrice', less)
            query1.greaterThanOrEqualTo('suggestedRetailPrice', greater)
            query1.include("image");
            query1.limit(12);
            query1.matchesQuery("brands", query2);
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
                    setBrandProducts(products);
                    setIsDataUpdated(true)
                },
                (error) => {
                    alert("error");
                }
            );
        }
    }

    return (
        <>
            {/* data Loader */}
            <div className='loader'>
                <ReactSpinner type="border" color="danger" size="7" />
            </div>

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
                            <div className="img-fluid ">
                                {headerName && headerName[0].get('brand_image') ?
                                    <img className='banner_image' src={headerName && headerName[0].get('brand_image')._url} />
                                    : <img className='banner_image' src='https://source.unsplash.com/WLUHO9A_xik/1000x600' />}
                            </div>
                            {/* <div className="category-description std">
                                <div className="slider-items-products">
                                    <div id="category-desc-slider" className="product-flexslider hidden-buttons">
                                        <div className="slider-items slider-width-col1 owl-carousel owl-Template">
                                            <div className="item"> <Link href="#x"><img alt="products" src="images/cat-slider-img1.jpg" /></Link>
                                                <div className="inner-info">
                                                    <div className="cat-img-title"> <span>Best Product 2017</span>
                                                        <h2 className="cat-heading">Best Selling Brand</h2>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                                        <Link className="info" href="#">Shop Now</Link> </div>
                                                </div>
                                            </div>

                                            <div className="item"> <Link href="#x"><img alt="products" src="images/cat-slider-img2.jpg" /></Link> </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="shop-inner">
                                <div className="page-title">
                                    <h2>{headerName && headerName[0].get('name')}</h2>
                                </div>
                                <div className="toolbar">
                                    <div className="view-mode">
                                        <ul>
                                            <li className="active"> <Link href=""> <i className="fa fa-th-large"></i> </Link> </li>
                                            <li> <Link> <i className="fa fa-th-list"></i> </Link> </li>
                                        </ul>
                                    </div>
                                    {/* <div className="sorter">
                                        <div className="short-by">
                                            <label>Sort By:</label>
                                            <select>
                                                <option selected="selected">Position</option>
                                                <option>Name</option>
                                                <option>Price</option>
                                                <option>Size</option>
                                            </select>
                                        </div>
                                        <div className="short-by page">
                                            <label>Show:</label>
                                            <select onChange={(e) => setpostsPerPage(e.target.value)} value={postsPerPage}>
                                                <option selected="selected" value='1' >1</option>
                                                <option value='3'>3</option>
                                                <option value='4'>4</option>
                                                <option value='8'>8</option>
                                            </select>
                                        </div>

                                    </div> */}
                                </div>
                                <div className="product-grid-area">
                                    <ul className="products-grid">
                                        {brandProducts && brandProducts.length !== 0 ?
                                            brandProducts && brandProducts.map((data, index) => {
                                                if (data.get('name')) {
                                                    let StockIn = data.get('qty')
                                                    const imgSrc = getProductImageByName(data)
                                                    return (
                                                        <li key={index}
                                                            className="item col-lg-4 col-md-4 col-sm-6 col-xs-6 ">
                                                            <div key={index}
                                                                className="product-item">
                                                                <div
                                                                    className="item-inner">
                                                                    <div
                                                                        className="product-thumbnail">
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
                                                                                <figure className="img-div">
                                                                                    <img className="first-img custom-height img-fulid" src={imgSrc} alt={data.get('name')} />
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
                                                                            <div className="item-title"> <Link title={data.get('name')} to={`/product/${data.get("slug")}`}>{data.get('name')} </Link> </div>
                                                                            <div className="item-content">
                                                                                {renderRatingStars(data.get('rating'))}
                                                                                <div className="item-price">
                                                                                    <div className="price-box"> <span className="regular-price"> <span className="price">{currencySign} {data.get('suggestedRetailPrice')}</span> </span> </div>
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
                                                                                                <button type="button" className="add-to-cart" onClick={() => {
                                                                                                    handle(data.id, false, true)
                                                                                                    setShow(true)
                                                                                                }}>
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
                                                        </li>
                                                    )
                                                }
                                            })
                                            :
                                            loader ? LoaderSet() : <h5>No result found</h5>
                                        }
                                    </ul>
                                </div>
                                {/* <Pagination postsPerPage={postsPerPage} totalPosts={sellingcard.length} paginate={paginate}></Pagination> */}
                            </div>
                        </div>
                        <aside className="sidebar col-sm-3 col-xs-12 col-sm-pull-9">
                            <div className="block shop-by-side">
                                <div className="block-content">
                                    <div className="sidebar-bar-title">
                                        <h3>Price</h3>
                                    </div>
                                    <div className="block-content">
                                        <div className="slider-range">
                                            <div data-label-reasult="Range:" data-min="0" data-max="500" data-unit="$" className="slider-range-price" data-value-min="50" data-value-max="350"></div>
                                            {/* <div className="amount-range-price">Range: $10 - $550</div> */}
                                            <ul className="check-box-list">
                                                <li onClick={() => handlePriceFilter(0, 10)}>
                                                    <input type="checkbox" id="p1" name="cc" />
                                                    <label for="p1"> <span className="button" ></span> {currencySign}0 - {currencySign}10 </label>
                                                </li>
                                                <li onClick={() => handlePriceFilter(50, 10)}>
                                                    <input type="checkbox" id="p2" name="cc" />
                                                    <label for="p2"> <span className="button"></span> {currencySign}10 - {currencySign}50 </label>
                                                </li>
                                                <li onClick={() => handlePriceFilter(50, 100)}>
                                                    <input type="checkbox" id="p3" name="cc" />
                                                    <label for="p3"> <span className="button"></span> {currencySign}50 - {currencySign}100 </label>
                                                </li>
                                                <li onClick={() => handlePriceFilter(100, 200)}>
                                                    <input type="checkbox" id="p4" name="cc" />
                                                    <label for="p4"> <span className="button"></span> {currencySign}100 - {currencySign}200 </label>
                                                </li>
                                                <li onClick={() => handlePriceFilter(200, 500)}>
                                                    <input type="checkbox" id="p5" name="cc" />
                                                    <label for="p5"> <span className="button"></span> {currencySign}200 - {currencySign}500 </label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" id="p6" name="cc" onClick={() => handlePriceFilter(500, 1000)} />
                                                    <label for="p6"> <span className="button"></span> {currencySign}500 - {currencySign}1000 </label>
                                                </li>
                                                <li>
                                                    <input type="checkbox" id="p7" name="cc" onClick={() => clearAllFilter(subCategoryId)} />
                                                    <label for="p7"> <span className="button"></span> clear All </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <br></br>
                                    {/* <p className="block-subtitle">Shopping Options</p> */}
                                    <div className="layered-Category">
                                        <h2 className="saider-bar-title">Category</h2>
                                        <div className="layered-content">

                                            <ul className="check-box-list">
                                                {/* {
                                                    brandsName && brandsName.map((data, index) => (
                                                        <li >
                                                            <input type="checkbox" id={index} name="cc" />
                                                            <label for={index} onClick={() => {
                                                                handleBrand(data.id)
                                                            }
                                                            }> <span className="button"></span>{data.get('name')}<span className="count"></span> </label>
                                                        </li>
                                                    ))
                                                } */}

                                                {/* {bestCategory && bestCategory.map((data) => {
                                                    return (
                                                        <>
                                                            <h5>{data.name}:</h5>
                                                            {data && data.subCategories.map((subcategory, index) => {
                                                                let name = subcategory.id
                                                                return (
                                                                    <>
                                                                        <li key={index}>
                                                                            <input type="checkbox" id={name} name="cc" />
                                                                            <label for={subcategory.id} onClick={() => handleSubcategoryProd(subcategory.id)}> <span className="button"></span>{subcategory.get('name')} </label>
                                                                        </li>
                                                                    </>
                                                                )
                                                            })}
                                                            {data.subCategories.map((subcategory) => {
                                                                <li></li>
                                                            })}
                                                        </>
                                                    )
                                                })} */}

                                                {bestCategory && bestCategory.map((data) => {
                                                    return (
                                                        <>
                                                            <h5>{data.name}:</h5>
                                                            {data && data.subCategories.map((subcategory, index) => {
                                                                let id = subcategory.id
                                                                return (
                                                                    <>
                                                                        <li key={index}>
                                                                            <input type="checkbox" id={id} name="cc" />
                                                                            <label for={subcategory.id} onClick={() => handleSubcategoryProd(subcategory.id)}> <span className="button"></span>{subcategory.get('name')} </label>
                                                                        </li>
                                                                        {/* <li className='handlesubcategory' key={index} onClick={() => handleSubcategoryProd(subcategory.id)}>{subcategory.get('name')}</li >  */}
                                                                    </>
                                                                )
                                                            })}
                                                            {/* {data.subCategories.map((subcategory) => {
<li></li>
})} */}
                                                        </>
                                                    )
                                                })}

                                            </ul>
                                        </div>
                                    </div>
                                    {/* <div className="color-area">
                                        <h2 className="saider-bar-title">Color</h2>
                                        <div className="color">
                                            <ul>
                                                <li><Link href="#"></Link></li>
                                                <li><Link href="#"></Link></li>
                                                <li><Link href="#"></Link></li>
                                                <li><Link href="#"></Link></li>
                                                <li><Link href="#"></Link></li>
                                                <li><Link href="#"></Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="size-area">
                                        <h2 className="saider-bar-title">Size</h2>
                                        <div className="size">
                                            <ul>
                                                <li><Link href="#">S</Link></li>
                                                <li><Link href="#">L</Link></li>
                                                <li><Link href="#">M</Link></li>
                                                <li><Link href="#">XL</Link></li>
                                                <li><Link href="#">XXL</Link></li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div className="block product-price-range ">
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
                            </div> */}

                        </aside>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Brands;