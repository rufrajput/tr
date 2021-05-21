import React, { useState, useEffect, useContext } from 'react'
// import { useParams } from 'react-router-dom';
import { Parse } from 'parse';
import { ProductCarousel } from '../../Components/carousel/ProductCarousel';
import Magnifier from "react-magnifier";
import { Link } from 'react-router-dom'
import { CartContext } from '../../contextapi/context_cart';
import { wishContext } from '../../contextapi/WishListContext';
import RoutingHistory from '../../RoutingHistory';
import { notification } from 'antd';
import ModalCart from "../../Components/CartModal/ModalCart";
import { Modal } from 'react-bootstrap';
import {LoginContext} from '../../contextapi/LoginContext';

const Product_detail = (props) => {

    const [productDetail, setProductDetail] = useState();
    const [itemCount, setItemCount] = useState(1);
    const [currencySign, setCurrencySign] = useState();
    const [Rating, setRatings] = useState();
    const [multipleImg, setMultipleImg] = useState();
    const [multipleImgUrl, setMultipleImgUrl] = useState();
    const [multipleImgFound, setMultipleImgFound] = useState(false);
    const [mainImg, setMainImg] = useState();
    const [show, setShow] = useState(false);
    const [productSecondaryImages, setProductSecondaryImages] = useState();
    const [quickViewShow, setquickViewShow] = useState(false);
    const [quickViewProp, setQuickViewProp] = useState('');
    const handleCloseQuickView = () => setquickViewShow(false);
    const [cartModalProp, setcartModalProp] = useState('');
    const { custmerName } = useContext(LoginContext);

    const handleClose = () => setShow(false);
    // const { id } = useParams();

    useEffect(() => {
        const Details = Parse.Object.extend('Products')
        const query = new Parse.Query(Details);
        query.equalTo('objectId', props.id)
        query.include('product_image');
        query.equalTo("isVisible", true);
        query.include('Category');
        query.include('SubCategory');
        query.include("brands");
        query.get(props.id).then(
            (result) => {
                setProductDetail(result)
                let imgSrc = '';
                if (result.get('imageUrl')) {
                    imgSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + result.get("imageUrl")
                }
                else {
                    imgSrc = result.get("image").get("featuredImage")._url
                    // imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
                }
                setMainImg(imgSrc);
                setProductSecondaryImages()
                //  setProductDetail(result)
                let imageIds = result.get('image').get('productImagesArr');
                let ImagesArr = result.get('imageUrlArr');
                if (ImagesArr) {
                    let imgArr = ImagesArr.split(',');
                    setMultipleImg(imgArr);
                    setMultipleImgFound(true);
                } else {
                    let imgsArr = []
                    imageIds.map((img) => {
                        imgsArr.push(img._url)
                    });
                    setMultipleImgUrl(imgsArr);
                    setMultipleImgFound(false);
                }
            }
        )
        const Ratings = Parse.Object.extend('Ratings')
        const ratings = new Parse.Query(Ratings);
        // ratings.equalTo("isApproved", true)
        ratings.equalTo('product', { "__type": "Pointer", "className": "Products", "objectId": props.id });
        ratings.find().then(
            (result) => {
                setRatings(result)
            });

        const Extras = Parse.Object.extend('Extras');
        const extra = new Parse.Query(Extras);
        extra.limit(1);
        extra.find().then((results) => {
            setCurrencySign(results[0].get("priceSymbol"))
        }, (error) => {
            console.error('Error while fetching Extras', error);
        });

    }, [props.id]);

    const ImageChange = (src) => {
        setProductSecondaryImages(src);
    }
    //for toste alert
    const openToste = () => {
        notification.success({
            message: 'Item added to your Wishlist ',
        });
    };

    const { addToCart, incrementItem, decrementItem } = useContext(CartContext)
    const { addToWish } = useContext(wishContext)
    const handle = (id, isAddToCart, isBuyNow = false) => {
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
                    imgUrlSrc = result.get("image").get("featuredImage")._url
                    // imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
                }
                const obj = {
                    id: result.id,
                    name: result.get('name'),
                    img:  imgUrlSrc ,
                    qty: itemCount,
                    dbQuantity: result.get('qty'),
                    price: result.get('suggestedRetailPrice')
                }
                if (isAddToCart) {
                    addToCart(obj)
                }
                else {
                    addToWish(obj)
                }
            }
        )
        if (isBuyNow)
        if(custmerName && custmerName.get('username')){
            RoutingHistory.push('/shippinginfo');
        }else{
            RoutingHistory.push('/checkout');
        }

    }
    const renderStockAvailabilty = () => {
        const productCount = productDetail && productDetail.get('qty');
        if (productCount > 0) {

            return (
                <p className="availability pull-right"> <span>In Stock</span></p>
            )
        }
        else {

            return (
                <p className="availability pull-right"> <span>Out of Stock</span></p>
            )
        }
    }
    //Check 
    const IsSaleProduct = () => {
        const CheckSale = productDetail && productDetail.get('onSale');
        if (CheckSale === true)
            return (
                <>
                    <p className="special-price"> <span className="price-label">Special Price</span> <span className="price">{currencySign} {productDetail && productDetail.get('salePrice')} </span> </p>
                    <p className="old-price"> <span className="price-label">Regular Price:</span> <span className="price"> {currencySign} {productDetail && productDetail.get('suggestedRetailPrice')}  </span> </p>
                </>
            )
        else {
            return (
                <p className="special-price"> <span className="price-label">Special Price</span> <span className="price">{currencySign} {productDetail && productDetail.get('suggestedRetailPrice')} </span> </p>
            )
        }
    }

    const renderRatingStars = () => {
        const ratingValues = Rating && Rating.map((data) => data.get("qualityRating"))
            const avgRating = ratingValues && ratingValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / ratingValues.length;
            switch (Math.ceil(avgRating)) {
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
    const handleQuick = (id) => {
        setShow(true)
        setQuickViewProp(id)
    }

    const InStock = () => {
        const IsInStock = productDetail && productDetail.get('qty');
        if (IsInStock > 0) {
            return (
                <>
                    <div className="product-variation" >
                        <form action="#" method="post">
                            <div className="cart-plus-minus">
                                <label for="qty">Quantity:</label>
                                <div className="numbers-row">
                                    <div onClick={handleDecrement} className="dec qtybutton"><i className="fa fa-minus">&nbsp;</i></div>
                                    <input type="text" className="qty" title="Qty" value={itemCount} maxLength="12" id="qty" name="qty" readOnly />
                                    {itemCount < IsInStock ?
                                    <div onClick={handleIncrement} className="inc qtybutton"><i className="fa fa-plus">&nbsp;</i></div>
                                    : <div className="inc qtybutton disabled pointer_none"><i className="fa fa-plus">&nbsp;</i></div>}
                                </div>
                            </div>
                            <button className="button pro-add-to-cart" title="Add to Cart" type="button" onClick={() => {
                                handle(productDetail && productDetail.id, true, false)
                                handleQuick(productDetail && productDetail.id)

                            }}>
                                <span><i className="fa fa-shopping-basket"></i> Add to Cart</span></button>
                            <button className="button buy_now" title="BUY NOW" type="button" onClick={() =>
                                handle(productDetail && productDetail.id, true, true)


                            }>
                                <i className="icon-basket-loaded icons"> </i>
                                <span>  BUY NOW </span>
                            </button>
                        </form>
                    </div>
                </>
            )
        } else {
            return (
                <div className="disabled">
                    <div className="product-variation" >
                        <form action="#" method="post">
                            <div className="pointer_none">
                                <label for="qty" >Quantity:</label>
                                <div className="numbers-row">
                                    <div className="dec qtybutton"><i className="fa fa-minus">&nbsp;</i></div>
                                    <input type="text" className="cart_qty" title="Qty" value={itemCount} maxLength="12" id="qty" name="qty" readOnly />
                                    <div className="inc qtybutton"><i className="fa fa-plus">&nbsp;</i></div>
                                </div>
                                <br />
                                <div className='quickview-style'>
                                    <button className="button pro-add-to-cart" title="Add to Cart" type="button">
                                        <span><i className="fa fa-shopping-basket"></i> OUT OF STOCK</span></button>
                                    <button className="button buy_now" title="BUY NOW" type="button">
                                        <i className="icon-basket-loaded icons"> </i>
                                        <span>  BUY NOW </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }


    const handleIncrement = () => {
        incrementItem(productDetail && productDetail.id);
        setItemCount(itemCount + 1);
    }
    const handleDecrement = () => {
        decrementItem(productDetail && productDetail.id);
        if (itemCount > 1)
            setItemCount(itemCount - 1);
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
            <div className="main-container col1-layout">
                <div className="">
                    <div className="row">
                        <div className="col-main">
                            <div className="product-view-area">
                                <div className="product-big-image col-xs-12 col-sm-5 col-lg-5 col-md-5">
                                    {
                                        productDetail && productDetail.get('isNew') === true
                                            ? <div className="icon-new-label new-right">New</div>
                                            : null
                                    }
                                    {
                                        productDetail && productDetail.get('isFeaturedOffer') === true
                                            ? <div className="ribbon">Featured</div>
                                            : null
                                    }
                                    {

                                        productDetail && productDetail.get('onSale') === true
                                            ? <div className="icon-sale-label sale-left">Sale</div>
                                            : null}
                                    <div className="large-image"> <Link> <Magnifier className="zoom-img" src={productSecondaryImages || mainImg} alt={productDetail && productDetail.get('name')} /> </Link></div>

                                    {multipleImg && multipleImg.length > 1 ?
                                        <ProductCarousel>
                                            {
                                                multipleImgFound ?
                                                    multipleImg && multipleImg.map((itemImg, index) => (
                                                        <li key={index} onClick={() => ImageChange(`https://cdn.technowise360.com/assets/catalog_600X600/${itemImg}`)} className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">
                                                            <img src={`https://cdn.technowise360.com/assets/catalog_600X600/${itemImg}`}
                                                                alt={productDetail && productDetail.get('name')} />
                                                        </li>)
                                                    )
                                                    :
                                                    multipleImgUrl && multipleImgUrl.map((itemImg, index) => (
                                                        <li key={index} onClick={() => ImageChange(itemImg)} className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">
                                                            <img src={itemImg}
                                                                alt={productDetail && productDetail.get('name')} />
                                                        </li>)
                                                    )
                                            }
                                        </ProductCarousel>
                                        : null
                                    }
                                </div>
                                <div className="col-xs-12 col-sm-7 col-lg-7 col-md-7 product-details-area">
                                    <div className="product-name">
                                        <h1>{productDetail && productDetail.get('name')}</h1>
                                    </div>
                                    <div className="price-box">
                                        {IsSaleProduct()}

                                        <div className="brand-box">
                                            <p className="">
                                                <span className="brand_txt">Product Brand: </span>
                                                {productDetail && productDetail.get('brands') ?
                                                    <>
                                                        <span className="brand_name" style={{ color: 'black' }}>
                                                            {
                                                                productDetail && productDetail.get('brands').get('name')
                                                            }
                                                        </span>
                                                    </>
                                                    : <h6>Not Found</h6>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ratings">

                                        {renderRatingStars()}

                                        <p className="rating-links"> <Link to="#"> {Rating && Rating.length > 0 ? Rating.length : 0} Review(s)</Link> </p>

                                        {renderStockAvailabilty()}
                                    </div>
                                    <div className="short-description">
                                        <h2>Quick Overview</h2>
                                    </div>
                                    <table class="table pkg_table">
                                        <tbody>
                                            <tr>
                                                <td className="w-60">
                                                    <img className="img-responsive package_img" src={'https://cdn.technowise360.com/assets/catalog_600X600/catalog/---vizard/VI-WYOM1_1000x1000.jpg'} alt="Products" />
                                                </td>
                                                <td>
                                                    <h6>2 x <Link to="#">Product Name</Link></h6>
                                                    <div class="form-group mb-0">
                                                        <select class="form-control " id="colors_select">
                                                            <option selected>Colors</option>
                                                            <option>Black</option>
                                                            <option>Orange</option>
                                                            <option>Yellow</option>
                                                            <option>Blue</option>
                                                            <option>White</option>
                                                        </select>
                                                        <select class="form-control " id="size_select">
                                                            <option selected>Size</option>
                                                            <option>8</option>
                                                            <option>9</option>
                                                            <option>10</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <h6 className="price">₱ 350</h6>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="w-60">
                                                    <img className="img-responsive package_img" src={'https://cdn.technowise360.com/assets/catalog_600X600/catalog/---vizard/VI-WYOM1_1000x1000.jpg'} alt="Products" />
                                                </td>
                                                <td>
                                                    <h6>1 x <Link to="#">Product Name</Link></h6>
                                                </td>
                                                <td className="text-right">
                                                    <h6 className="price">₱ 350</h6>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="w-60">
                                                    <img className="img-responsive package_img" src={'https://cdn.technowise360.com/assets/catalog_600X600/catalog/---vizard/VI-WYOM1_1000x1000.jpg'} alt="Products" />
                                                </td>
                                                <td>
                                                    <h6>4 x <Link to="#">Product Name</Link></h6>
                                                </td>
                                                <td className="text-right">
                                                    <h6 className="price">₱ 350</h6>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {
                                        <div dangerouslySetInnerHTML={{ __html: productDetail && productDetail.get('description') }}>
                                        </div>
                                    }
                                    {/* <div className="product-color-size-area">
                                        <div className="color-area">
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
                                        </div>
                                    </div> */}
                                    {InStock()}
                                    <div className="product-cart-option">
                                        <ul>
                                            <li><Link onClick={() => {
                                                handle(productDetail && productDetail.id, false, false)
                                                openToste()
                                            }}><i className="fa fa-heart-o"></i><span>Add to Wishlist</span></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Product_detail