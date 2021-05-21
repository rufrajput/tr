import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { Parse } from 'parse';
import { SectionCarousel } from '../Components/carousel/SectionCarousel';
import { ProductCarousel } from '../Components/carousel/ProductCarousel';
import Magnifier from "react-magnifier";
import { Link } from 'react-router-dom'
import { CartContext } from '../contextapi/context_cart';
import { wishContext } from '../contextapi/WishListContext';
import { LoginContext } from '../contextapi/LoginContext';
import RoutingHistory from '../RoutingHistory';
import ReviewRating from '../Components/Ratings/ReviewRating';
import AddReview from '../Components/Ratings/AddReview';
import { compareContext } from '../contextapi/CompareListContext';
import { Modal } from 'react-bootstrap';
import { notification } from 'antd';
import QuickView from './Sections/QuickView';
import { ModalCarousel } from '../Components/carousel/ModalCarousel';
import ModalCart from "../Components/CartModal/ModalCart";
import { getProductImageByName, getProductImageByID, getProductImageForAddOns } from '../Components/utils/ProductImage';
import { Helmet } from "react-helmet";


const Product_detail = () => {

    const [productDetail, setProductDetail] = useState();
    const [productDet, setProductDet] = useState();
    const [itemCount, setItemCount] = useState(1);
    const [relatedProduct, setRelatedProduct] = useState();
    const [currencySign, setCurrencySign] = useState();
    const [sellProducts, setSellProducts] = useState();
    const [Rating, setRatings] = useState();
    const [variant, setVariant] = useState([]);
    const [show, setShow] = useState(false);
    // const [handleAddOn, setHandleAddOn] = useState(false);
    const [productSecondaryImages, setProductSecondaryImages] = useState();
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const [quickViewShow, setquickViewShow] = useState(false);
    const [quickViewProp, setQuickViewProp] = useState('');
    const handleClose = () => setShow(false);
    const handleCloseQuickView = () => setquickViewShow(false);
    const { name } = useParams();
    const [multipleImg, setMultipleImg] = useState();
    const [previewImage, setPreviewImage] = useState();
    const [multipleImgUrl, setMultipleImgUrl] = useState();
    const [multipleImgFound, setMultipleImgFound] = useState(false);
    // const [productCheck, setProductCheck] = useState(true);
    // const [relatedItemCheck, setRelatedItemCheck] = useState(true);
    // const [firstDefaultVariant, setFirstDefaultVariant] = useState();
    // const [productCheck3, setProductCheck3] = useState(true);
    // const [defaultCheckAttribute, setDefaultCheckAtrribute] = useState(true);
    // const [filtrationVariableProd, setFiltrationVariableProd] = useState(true);
    // const [variantVariable, setVariantVariable] = useState();
    const [secondaryImgClicked, setSecondaryImgClicked] = useState();
    const [related, setRelated] = useState();
    const [mainImg, setMainImg] = useState();
    const [addOnProducts, setAddOnProducts] = useState();
    const [addOnProductsobject, setAddOnProductsObject] = useState();
    const [addOnAddTOCart, setAddOnAddToCart] = useState();
    const [secondRelatedData, setSecondRelatedData] = useState();
    // const [isRelatedItemRemoved, setIsRelatedItemRemoved] = useState(true);
    const [relatedItemsPrice, setRelatedItemsPrice] = useState();
    const [cartModalProp, setcartModalProp] = useState('');
    const [bandleProduct, setBandleProduct] = useState('');
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState([]);
    const [sizeDefault, setSizeDefault] = useState({});
    const [contLength, setContLength] = useState(0);
    const [productFilterSizes, setProductFilterSizes] = useState();
    // const [productAgainstVariant, setProductAgainstVariant] = useState();
    const [productAgainstVariantId, setProductAgainstVariantId] = useState();
    const { custmerName } = useContext(LoginContext);

    useEffect(() => {
        var ratingResultId;
        const Details = Parse.Object.extend('Products')
        const query = new Parse.Query(Details);
        query.include('image');
        query.equalTo("isVisible", true);
        query.include('Category');
        query.include('SubCategory');
        query.include("brands");
        query.equalTo('slug', name)
        query.find().then(
            (result) => {
                setProductDet(result)
                setProductAgainstVariantId(result[0].id)
                let freqLength = result[0].get("frequentlyBoughtProducts");
                ratingResultId = result[0].id;
                console.log('main product Id ', ratingResultId)
                const Ratings = Parse.Object.extend('Ratings')
                const ratings = new Parse.Query(Ratings);
                // ratings.equalTo("isApproved", true)
                ratings.equalTo('product', { "__type": "Pointer", "className": "Products", "objectId": ratingResultId && ratingResultId });
                ratings.find().then(
                    (result) => {
                        setRatings(result)
                    });
                let imgSrc = '';
                if (result[0].get('imageUrl')) {
                    imgSrc = "https://cdn.technowise360.com/assets/catalog_600X600/" + result[0].get("imageUrl")
                }
                else {
                    if (result[0].get("image").get("featuredImage")) {
                        imgSrc = result[0].get("image").get("featuredImage")._url
                    }
                    else {
                        imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
                    }
                    // imgSrc = "https://parseapi.back4app.com/files/QbhRDPezDl2gqctMY8HgwWfJXhKfKA4Ct8Q7ocDf/b4b9aaf01963a4a5ab0eacb61397df5b_img_placeholder.png"
                }
                setMainImg(imgSrc);
                setProductSecondaryImages()
                if (result[0].get('image').get('productImagesArr') || result[0].get('imageUrlArr')) {
                    let imageIds = result[0].get('image').get('productImagesArr');
                    let ImagesArr = result[0].get('imageUrlArr');
                    if (ImagesArr) {
                        let imgArr = ImagesArr.split(',');
                        setMultipleImg(imgArr);
                        setMultipleImgFound(true);
                        setPreviewImage(imgArr[0]);
                    } else {
                        let imgsArr = []
                        imageIds.map((img) => {
                            imgsArr.push(img._url)
                            setPreviewImage(img._url);
                        });
                        setMultipleImgUrl(imgsArr);
                        setMultipleImgFound(false);
                    }
                }

                if (result[0].get('productType') === 'variable') {
                    const ProductsAttri = Parse.Object.extend("ProductAttributes");
                    const prodAtr = new Parse.Query(ProductsAttri);
                    prodAtr.include('variantId.attributeId')
                    prodAtr.include('mainProductId')
                    prodAtr.include('variantProductId')
                    prodAtr.equalTo("mainProductId", { "__type": "Pointer", "className": "Products", "objectId": result[0].id })
                    prodAtr.include('variantId.attributeId')
                    prodAtr.find().then(
                        (results) => {

                            let variantFinal = [];
                            results.map((variant) => {
                                let attributeName = variant.get('variantId').get('attributeId').get('name')
                                let attributeValue = variant.get('variantId')
                                if (variantFinal.length == 0) {
                                    let val = [attributeName, [attributeValue]]
                                    variantFinal.push(val);
                                } else {
                                    let attrFound = false;
                                    for (let i = 0; i < variantFinal.length; i++) {
                                        if (variantFinal[i][0] === attributeName) {
                                            let valueFound = false;
                                            for (let j = 0; j < variantFinal[i][1].length; j++) {
                                                if (variantFinal[i][1][j].get('name') === attributeValue.get('name')) {
                                                    valueFound = true;
                                                }
                                            }
                                            if (!valueFound) {
                                                variantFinal[i][1].push(attributeValue);
                                            }

                                            attrFound = true;
                                            break;

                                        }
                                    }
                                    if (!attrFound) {
                                        let val = [attributeName, [attributeValue]]
                                        variantFinal.push(val);
                                    }
                                }
                            })
                            setVariant(variantFinal)
                            var objects = {};
                            let keyName
                            for (let i = 0; i < variantFinal.length; i++) {
                                keyName = variantFinal[i][0]
                                objects[keyName] = '';
                            }
                            setSizeDefault(objects)
                            // variantProduct(variantFinal[0][1][0].id)
                            console.log('varianyFinal :', variantFinal)
                            // variantProduct(variantFinal[0][1][0].id)// first color size selection
                        },
                        (error) => {
                            alert("error");
                        }

                    );
                }
                else {
                    if (result[0].get('productType') === 'bundle') {
                        const Bundle = Parse.Object.extend("BundleProduct");
                        const bundledata = new Parse.Query(Bundle);
                        bundledata.include('bundleProductId')
                        bundledata.include('productId.image.Category.SubCategory.brands')
                        bundledata.equalTo("bundleProductId", { "__type": "Pointer", "className": "Products", "objectId": result[0].id })
                        bundledata.find().then(
                            (result) => {
                                setBandleProduct(result)

                            },
                            (error) => {
                                alert("error");
                            }
                        );
                    } else {
                        const RelatedP = Parse.Object.extend('Products')
                        const query = new Parse.Query(RelatedP);
                        query.equalTo("isVisible", true);
                        query.include('image');
                        query.limit(6);
                        query.equalTo('brands', result[0].get("brands"));
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
                                setRelatedProduct(products)
                                setIsDataUpdated(true);
                                setVariant('')
                                setBandleProduct('')//update brnad state
                                setProductFilterSizes('')//update state if single Product
                            });
                    }
                }
                //for frequently bought together
                const Products = Parse.Object.extend('Products')
                const query = new Parse.Query(Products);
                query.containedIn('objectId', result[0].get('frequentlyBoughtProducts'));
                query.find().then(
                    (result) => {
                        setRelated(result)
                        setRelatedItemsPrice(result && result.reduce((prev, current) => (prev + current.get('suggestedRetailPrice')), 0))
                        setSecondRelatedData(result)
                    })

                //Add on products

                const ProductsAddOn = Parse.Object.extend('ProductAddOns')
                const prodAddOn = new Parse.Query(ProductsAddOn);
                // prodAddOn.equalTo("isVisible", true);
                prodAddOn.include('addOnId.image')
                // prodAddOn.containedIn('productId', result[0].id);
                prodAddOn.equalTo('productId', { "__type": "Pointer", "className": "Products", "objectId": result[0].id })
                prodAddOn.find().then(
                    (result) => {
                        // console.log('abc', result)
                        setAddOnProducts(result)

                        var objects = {};
                        let keyName
                        for (let i = 0; i < result.length; i++) {
                            keyName = result[i].get('addOnId').get('name')
                            objects[keyName] = '';
                        }
                        setAddOnProductsObject(objects)
                    })
            }
        )
        const Extras = Parse.Object.extend('Extras');
        const extra = new Parse.Query(Extras);
        extra.limit(1);
        extra.find().then((results) => {
            setCurrencySign(results[0].get("priceSymbol"))
        }, (error) => {
            console.error('Error while fetching Extras', error);
        });
        const SellingProducts = Parse.Object.extend('Products')
        const sellingproducts = new Parse.Query(SellingProducts);
        sellingproducts.equalTo('onSale', true);
        sellingproducts.notEqualTo("brands", null)
        sellingproducts.equalTo("isVisible", true);
        sellingproducts.limit(10);
        sellingproducts.include('image');
        sellingproducts.find().then(
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
                setSellProducts(products)
                setIsDataUpdated(true);
            }
            , error => {
                console.log("Result not found", error)
            }
        )
    }, [name, isDataUpdated]);

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


    const changeImageData = (highlightValue, length) => {
        const variantProduct = [];
        const ProductsAttri = Parse.Object.extend("ProductAttributes");
        const prodAtr = new Parse.Query(ProductsAttri);
        prodAtr.include('variantId.attributeId')
        prodAtr.include('variantProductId')
        prodAtr.include('variantId')
        console.log('highlighted value :', highlightValue)
        prodAtr.include('mainProductId')
        prodAtr.equalTo('mainProductId', { "__type": "Pointer", "className": "Products", "objectId": productAgainstVariantId && productAgainstVariantId })
        prodAtr.containedIn("variantId", highlightValue)
        prodAtr.find().then(
            (res) => {
                console.log('resut =>', res)
                let finalArr = []
                res.map(a => { finalArr.push(a) })
                // console.log('final array :', finalArr)
                let idCount = {};
                let variantProductId;
                finalArr.forEach(product => {
                    idCount[product.get('variantProductId').id] = idCount[product.get('variantProductId').id] ? idCount[product.get('variantProductId').id] + 1 : 1;
                });
                for (const property in idCount) {
                    if (idCount[property] === length) {
                        console.log(`${property}: ${idCount[property]}`);
                        variantProductId = property;
                    }
                }
                console.log('variantProductId', variantProductId)
                const ProductsAttri = Parse.Object.extend("ProductAttributes");
                const prodAtr = new Parse.Query(ProductsAttri);
                prodAtr.include('variantProductId')
                prodAtr.include('mainProductId')
                prodAtr.equalTo("variantProductId", { "__type": "Pointer", "className": "Products", "objectId": variantProductId })
                prodAtr.find().then((res) => {
                    console.log('result :', res)
                    let ArrayFilter = []
                    if (res[0]) {
                        let data = res[0].get('variantProductId')
                        ArrayFilter.push(data)
                        setProductDet(ArrayFilter)
                    }

                })


            })
    }



    const variantProduct = (colorId) => {
        // setDefaultCheckAtrribute(false)
        let id = colorId.id;
        let key = colorId.get('attributeId').get('name') // Size;
        let selectionId = sizeDefault && sizeDefault
        selectionId[key] = id;
        let varintIdsToHighLight = Object.values(selectionId)
        // console.log('state update :',selectionId)
        console.log('only values :', varintIdsToHighLight)
        console.log('only values :', selectionId)
        let lenght = varintIdsToHighLight.length
        setSelectedVariant(varintIdsToHighLight)
        const ProductsAttri = Parse.Object.extend("ProductAttributes");
        const prodAtr = new Parse.Query(ProductsAttri);
        prodAtr.include('variantId.attributeId')
        prodAtr.include('variantProductId')
        prodAtr.include('variantId.attributeId')
        prodAtr.include('mainProductId')
        prodAtr.equalTo('mainProductId', { "__type": "Pointer", "className": "Products", "objectId": productAgainstVariantId && productAgainstVariantId })
        prodAtr.equalTo("variantId", { "__type": "Pointer", "className": "Variant", "objectId": colorId.id })
        prodAtr.find().then(
            (res) => {
                // console.log('resut', res)
                const ArrayFilter = []
                res.map((attribute) => ArrayFilter.push(attribute.get('variantProductId').id))
                // console.log('arrayFIlter :', ArrayFilter)
                const ProductsAttri = Parse.Object.extend("ProductAttributes");
                const prodAtr = new Parse.Query(ProductsAttri);
                prodAtr.include('variantId.attributeId')
                prodAtr.include('variantProductId')
                prodAtr.include('mainProductId')
                prodAtr.containedIn("variantProductId", ArrayFilter)
                prodAtr.find().then((results) => {
                    // console.log('before filtration results :', results)
                    let variantFinal = [];
                    results.map((variant) => {
                        let attributeName = variant.get('variantId').get('attributeId').get('name')
                        let attributeValue = variant.get('variantId')
                        if (variantFinal.length == 0) {
                            let val = [attributeName, [attributeValue]]
                            variantFinal.push(val);
                        } else {
                            let attrFound = false;
                            for (let i = 0; i < variantFinal.length; i++) {
                                if (variantFinal[i][0] === attributeName) {
                                    let valueFound = false;
                                    for (let j = 0; j < variantFinal[i][1].length; j++) {
                                        if (variantFinal[i][1][j].get('name') === attributeValue.get('name')) {
                                            valueFound = true;
                                        }
                                    }
                                    if (!valueFound) {
                                        variantFinal[i][1].push(attributeValue);
                                    }

                                    attrFound = true;
                                    break;

                                }
                            }
                            if (!attrFound) {
                                let val = [attributeName, [attributeValue]]
                                variantFinal.push(val);
                            }
                        }
                    })
                    setVariant(variantFinal)
                    // console.log('variant Final :', variantFinal)

                })
            })
        if (!(varintIdsToHighLight.some(element => element === ""))) {
            // console.log('some')
            changeImageData(varintIdsToHighLight, lenght)
        }
        // handleFilter(colorId)
    }


    const { item, addToCart, incrementItem, decrementItem, removeItem } = useContext(CartContext);
    const { addToWish } = useContext(wishContext)
    const { addToCompare } = useContext(compareContext)

    //context api  
    const handle = (id, compare, isAddToCart, isBuyNow = false) => {
        const Details = Parse.Object.extend('Products')
        const query = new Parse.Query(Details);
        query.include('image');
        query.get(id).then(
            (result) => {
                console.log('results :', result)
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
                    qty: itemCount,
                    dbQuantity: result.get('qty'),
                    price: result.get('suggestedRetailPrice')
                }
                if (isAddToCart) {
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
                else {
                    if (compare) {
                        addToCompare(obj)
                    } else {
                        addToWish(obj)
                    }
                }
            }
        )
        if (isBuyNow) {
            if (custmerName && custmerName.get('username')) {
                RoutingHistory.push('/shippinginfo');
            } else {
                RoutingHistory.push('/checkout');
            }
        }
    }

    // Add To Cart Frequnetly Bought Together Products
    const frequntilyBoughtProducts = (related, isAddtoCart, isBuyNow = false) => {
        console.log('check Related', related)
        for (let i = 0; i <= (related.length - 1); i++) {
            const itemImage = getProductImageByName(related[i]);
            const frequentBoughtItem = {
                id: related[i].id,
                name: related[i].get('name'),
                img: itemImage,
                dbQuantity: related[i].get('qty'),
                price: related[i].get('suggestedRetailPrice')
            }
            let qty = related[i].dbQuantity;
            // console.log('freq qty:', qty)
            if (!qty) {
                // console.log('qty > 0')
                if (isAddtoCart) {
                    addToCart(frequentBoughtItem)
                }
                else if (isBuyNow) {
                    // console.log('freq elseif')
                    if (custmerName && custmerName.get('username')) {
                        // console.log('freq if 2');
                        addToCart(frequentBoughtItem);
                        RoutingHistory.push('/shippinginfo');
                    } else {
                        // console.log('freq else 2');
                        addToCart(frequentBoughtItem);
                        RoutingHistory.push('/checkout');
                    }
                }
            }
        }
    }
    // Add To Cart Add on Products
    const AddOnsBoughtTogether = (addOnProducts, isAddtoCart, isBuyNow = false) => {
        let len = contLength && contLength
        for (let i = 0; i <= len - 1; i++) {
            if (addOnProducts[i] === "" || addOnProducts[i] === undefined) {
                continue
            }
            else {
                const itemImage = getProductImageForAddOns(addOnProducts[i]);
                const addOnBought = {
                    id: addOnProducts[i].get('addOnId').id,
                    name: addOnProducts[i].get('addOnId').get('name'),
                    img: itemImage,
                    dbQuantity: addOnProducts[i].get('addOnId').get('qty'),
                    price: addOnProducts[i].get('addOnId').get('suggestedRetailPrice')
                }
                let qty = addOnProducts[i].get('addOnId').dbQuantity;
                // console.log('freq qty:', qty)
                if (!qty) {
                    // console.log('qty > 0')
                    if (isAddtoCart) {
                        addToCart(addOnBought)
                    }
                    else if (isBuyNow) {
                        // console.log('freq elseif')
                        if (custmerName && custmerName.get('username')) {
                            // console.log('freq if 2');
                            addToCart(addOnBought);
                            RoutingHistory.push('/shippinginfo');
                        } else {
                            // console.log('freq else 2');
                            addToCart(addOnBought);
                            RoutingHistory.push('/checkout');
                        }
                    }
                }
            }
        }
    }

    //Check Stock Available or Not
    const renderStockAvailabilty = () => {
        const productCount = productDet && productDet[0].get('qty');
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
        const CheckSale = productDet && productDet[0].get('onSale');
        if (CheckSale == true)
            return (
                <>
                    <p className="special-price"> <span className="price-label">Special Price</span> <span className="price">{currencySign} {productDet && productDet[0].get('salePrice')} </span> </p>
                    <p className="old-price"> <span className="price-label">Regular Price:</span> <span className="price"> {currencySign} {productDet && productDet[0].get('suggestedRetailPrice')}  </span> </p>
                </>
            )
        else {
            return (
                <p className="special-price"> <span className="price-label">Special Price</span> <span className="price">{currencySign} {productDet && productDet[0].get('suggestedRetailPrice')} </span> </p>
            )
        }
    }
    const onSale = () => {
        const CheckSale = productDet && productDet[0].get('onSale');
        if (CheckSale == true) {
            return (
                <div className="icon-sale-label sale-right">Sale</div>
            )
        }

    }
    const IsNew = () => {
        const CheckNew = productDet && productDet[0].get('isNew');
        if (CheckNew == true) {
            return (
                <div className="icon-new-label new-right">New</div>
            )
        }

    }

    const IsFeatured = () => {
        const CheckFeatured = productDet && productDet[0].get('isFeaturedOffer');
        if (CheckFeatured == true) {
            return (
                <div className="ribbon">Featured</div>
            )
        }

    }
    const InStock = () => {
        const IsInStock = productDet && productDet[0].get('qty');
        if (IsInStock > 0) {
            return (
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
                            AddOnsBoughtTogether(addOnAddTOCart && addOnAddTOCart, true, false)
                            handle(productDet && productDet[0].id, false, true, false)
                            // handle(productDet && productDet[0].id)
                            handleModal(productDet && productDet[0].id)
                        }}>
                            <span><i className="fa fa-shopping-basket"></i> Add to Cart</span></button>
                        <button className="button buy_now" title="BUY NOW" type="button" onClick={() =>
                            handle(productDet && productDet[0].id, false, true, true)
                        }>
                            <i className="icon-basket-loaded icons"> </i>
                            <span>  BUY NOW </span>
                        </button>
                    </form>
                </div>
            )
        } else {
            return (
                <div className="product-variation disabled " >
                    <form action="#" method="post">
                        <div className="cart-plus-minus  pointer_none">
                            <label for="qty">Quantity:</label>
                            <div className="numbers-row">
                                <div className="dec qtybutton"><i className="fa fa-minus">&nbsp;</i></div>
                                <input type="text" className="qty" title="Qty" value={itemCount} maxLength="12" id="qty" name="qty" readOnly />
                                <div className="inc qtybutton"><i className="fa fa-plus">&nbsp;</i></div>
                            </div>
                        </div>
                        <button className="button pointer_none pro-add-to-cart" title="Add to Cart" type="button" >
                            <span><i className="fa fa-shopping-basket"></i> out of stock</span></button>
                        <button className="button buy_now pointer_none" title="BUY NOW" type="button" >
                            <i className="icon-basket-loaded icons"> </i>
                            <span>  BUY NOW </span>
                        </button>
                    </form>
                </div>
            )
        }
    }
    const renderRatingStars = () => {
        const ratingValues = Rating && Rating.map((data) => data.get("qualityRating"))
        if (ratingValues != 0) {
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
        else {
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

    const renderProductRatingStars = (rating) => {
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
    // const CheckboxFunc = (e, data) => {
    //     // setRelatedItemCheck(!relatedItemCheck)
    //     // setIsRelatedItemRemoved(!isRelatedItemRemoved)
    //     handleFrquentItemToggle(e, data)
    //     // setProductCheck(!productSecondaryImages)
    // }
    const handleAddProd = (e, data) => {
        var forSelectionIdKey = addOnProductsobject && addOnProductsobject
        if (e.target.checked) {
            let id = data;
            let key = data.get('addOnId').get('name') // Size;
            let selectionId = forSelectionIdKey
            selectionId[key] = id;
            var varintIdsToHighLight = Object.values(selectionId)
        }
        else {
            let id = data;
            let key = data.get('addOnId').get('name') // Size;
            let selectionId = forSelectionIdKey
            selectionId[key] = '';
            var varintIdsToHighLight = Object.values(selectionId)

        }
        setContLength(Object.keys(forSelectionIdKey).length);
        setAddOnAddToCart(varintIdsToHighLight)
    }


    const handleFrquentItemToggle = (e, data) => {
        if (!e.target.checked) {
            setRelated(related.filter(item => item.id !== data.id))
            setRelatedItemsPrice(relatedItemsPrice - data.get('suggestedRetailPrice'))
        }
        else {
            setRelatedItemsPrice(relatedItemsPrice + data.get('suggestedRetailPrice'))
            setRelated([data, ...related])
        }
    }
    const handleQuick = (id) => {
        setquickViewShow(true)
        setQuickViewProp(id)
    }

    const handleIncrement = () => {
        incrementItem(productDet && productDet[0].id);
        setItemCount(itemCount + 1);
    }
    const handleDecrement = () => {
        decrementItem(productDet && productDet[0].id);
        if (itemCount > 1)
            setItemCount(itemCount - 1);
    }

    const ImageChange = (src) => {
        setProductSecondaryImages(src);
    }
    const handleModal = (id) => {
        setcartModalProp(id);
        setShow(true)
    }

    return (
        <>
            {/* {variantProduct(sizeDefault && sizeDefault  )} */}
            <div>

                <Helmet>
                    <meta name="og:title" content="Product NTap" data-rh="true" />
                    <meta property="og:image" content={"https://cdn.technowise360.com/assets/catalog_600X600/" + previewImage} data-rh="true" />
                </Helmet>

                {productDet && productDet[0].get('imageUrl') ?
                    <Modal size='md' aria-labelledby="contained-modal-title-vcenter" centered className="pro_img_popup" animation={false} show={show1} onHide={handleClose1}>
                        {/* <Modal.Header closeButton>
                    </Modal.Header> */}
                        <Modal.Body > {
                            <>

                                <ModalCarousel>
                                    {/* <li className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">    <img src={mainImg} alt="products" /> </li> */}
                                    {
                                        multipleImgFound ?
                                            multipleImg && multipleImg.map((itemImg, index) => (
                                                <li key={index} onClick={() => ImageChange(`https://cdn.technowise360.com/assets/catalog_600X600/${itemImg}`)} className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">
                                                    <img src={`https://cdn.technowise360.com/assets/catalog_600X600/${itemImg}`}
                                                        alt={productDet && productDet[0].get('name')} />
                                                </li>)
                                            )
                                            :
                                            // multipleImgUrl && multipleImgUrl.map((itemImg, index) => (
                                            //     <li key={index} onClick={() => ImageChange(itemImg)} className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">
                                            //         <img src={itemImg}
                                            //             alt={productDet && productDet[0].get('name')} />
                                            //     </li>)
                                            // )
                                            null
                                    }
                                </ModalCarousel>
                            </>
                        }
                        </Modal.Body>
                        {/* <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose1}>
                            Close
                        </Button> 
                    </Modal.Footer> */}
                    </Modal>
                    : null}
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
            <div className="main-container col1-layout">
                <div className="container">
                    <div className="row">
                        <div className="col-main">
                            <div className="product-view-area">
                                <div className="product-big-image col-md-12 col-sm-5 col-lg-5 col-md-5">
                                    {onSale()}
                                    {IsNew()}
                                    {IsFeatured()}
                                    <div className="large-image">
                                        <Link onClick={() => setShow1(true)}>
                                            <Magnifier className="zoom-img" src={productSecondaryImages || mainImg} alt={productDet && productDet[0].get('name')} />
                                        </Link>
                                    </div>

                                    {multipleImg && multipleImg.length > 1 ?
                                        <ProductCarousel>
                                            {
                                                multipleImgFound ?
                                                    multipleImg && multipleImg.map((itemImg, index) => (
                                                        <li key={index} onClick={() => ImageChange(`https://cdn.technowise360.com/assets/catalog_600X600/${itemImg}`)} className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">
                                                            <img src={`https://cdn.technowise360.com/assets/catalog_600X600/${itemImg}`}
                                                                alt={productDet && productDet[0].get('name')} />
                                                        </li>)
                                                    )
                                                    :
                                                    multipleImgUrl && multipleImgUrl.map((itemImg, index) => (
                                                        <li key={index} onClick={() => ImageChange(itemImg)} className='cloud-zoom-gallery' rel="useZoom: 'zoom1'">
                                                            <img src={itemImg}
                                                                alt={productDet && productDet[0].get('name')} />
                                                        </li>)
                                                    )
                                            }
                                        </ProductCarousel>
                                        : null
                                    }
                                </div>
                                <div className="col-md-12 col-sm-7 col-lg-7 col-md-7 product-details-area">
                                    <div className="product-name">
                                        <h1>{productDet && productDet[0].get('name')}</h1>
                                    </div>
                                    <div className="price-box">

                                        {IsSaleProduct()}
                                        <div className="brand-box">
                                            <p className="">
                                                <span className="brand_txt">Product Brand: </span>
                                                {productDet && productDet[0].get('brands') ?
                                                    <>
                                                        <span className="brand_name" style={{ color: 'black' }}>
                                                            {
                                                                productDet && productDet[0].get('brands').get('name')
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
                                        {
                                            <div dangerouslySetInnerHTML={{ __html: productDet && productDet[0].get('description') }}>
                                            </div>
                                        }
                                        <table class="table pkg_table">
                                            <tbody>
                                                {bandleProduct && bandleProduct.map((data, index) => (
                                                    <tr>
                                                        {data.get('productId').get('productType') === 'variable' ?
                                                            <>
                                                                <td className="w-60">
                                                                    <img className="img-responsive package_img" src={data.get('productId').get('image').get('featuredImage')._url} alt="Products" />
                                                                </td>
                                                                <td>
                                                                    <h6>{data.get('quantity')} x <Link to="#">{data.get('productId').get('name')}</Link></h6>
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
                                                                    <h6 className="price">₱ {data.get('quantity') * data.get('productId').get('suggestedRetailPrice')}</h6>
                                                                </td>
                                                            </> : ''}
                                                    </tr>
                                                ))}
                                                {bandleProduct && bandleProduct.map((data, index) => (
                                                    <tr>
                                                        <td className="w-60">
                                                            <img className="img-responsive package_img" src={data.get('productId').get('image').get('featuredImage')._url} alt="Products" />
                                                        </td>
                                                        <td>
                                                            <h6>{data.get('quantity')}x <Link to="#">{data.get('productId').get('name')}</Link></h6>
                                                        </td>
                                                        <td className="text-right">
                                                            <h6 className="price">₱ {data.get('quantity') * data.get('productId').get('suggestedRetailPrice')}</h6>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {/* <tr>
                                                    <td className="w-60">
                                                        <img className="img-responsive package_img" src={'https://cdn.technowise360.com/assets/catalog_600X600/catalog/---vizard/VI-WYOM1_1000x1000.jpg'} alt="Products" />
                                                    </td>
                                                    <td>
                                                        <h6>4 x <Link to="#">Product Name</Link></h6>
                                                    </td>
                                                    <td className="text-right">
                                                        <h6 className="price">₱ 350</h6>
                                                    </td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                    {productDetail && productDetail.get('productType') === "single" ? '' :
                                        <div className="product-color-size-area">
                                            {
                                                variant && variant.map((data, index) => (
                                                    <div className="color-area">
                                                        <>
                                                            <h2 className="saider-bar-title" >{data[0]}</h2>
                                                            <div className="color">
                                                                <ul>
                                                                    {data && data[1].map((attri, index) => {
                                                                        let found = false;
                                                                        return (
                                                                            <li key={index}>
                                                                                {selectedVariant && selectedVariant.map((a) => {
                                                                                    if (a === attri.id) {
                                                                                        found = true;
                                                                                        return (
                                                                                            <Link to="#" className='highlight_Vlue' onClick={() => variantProduct(attri)} >{attri.get('name')}</Link>

                                                                                        )
                                                                                    }
                                                                                })}

                                                                                {!found ? <Link to="#" className='bg-black' onClick={() => variantProduct(attri)} >{attri.get('name')}</Link> : ''}
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        </>

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    {addOnProducts && addOnProducts.length == 0 ? ''
                                        :
                                        <div className="product_add_on" >
                                            <div className="add-on-description">
                                                <h2>Add On</h2>
                                                {addOnProducts && addOnProducts.map((data, index) => {
                                                    if (data.get('addOnId').get('qty') > 0) {
                                                        return (<div className="row mb-10">
                                                            <div className="col-md-1 option">
                                                                <input type="checkbox" onChange={(e) => handleAddProd(e, data)} name="option" /></div>
                                                            <img className="col-md-2 img" src={data.get('addOnId').get("image").get("featuredImage")._url} />
                                                            <div className="col-md-5"><p>{data.get('addOnId').get("name")}</p></div>
                                                            <div className="col-md-3 p-13"><span class="price">{currencySign}  {data.get('addOnId').get('suggestedRetailPrice')} </span></div>
                                                        </div>)
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    }
                                    {InStock()}
                                    {/* Work later */}
                                    <div className="product-cart-option">
                                        <ul>
                                            <li><Link onClick={() => {
                                                handle(productDet && productDet[0].id, false, false, false)
                                                openToste('wish')
                                            }}><i className="fa fa-heart-o"></i><span>Add to Wishlist</span></Link></li>
                                            <li><Link onClick={() => {
                                                handle(productDet && productDet[0].id, true, false, false)
                                                openToste()
                                            }}>
                                                <i className="fa fa-link"></i><span>Add to Compare</span></Link></li>
                                            {/* <li><Link to="#"><i className="fa fa-envelope"></i><span>Email to a Friend</span></Link></li> */}
                                        </ul>
                                    </div>
                                    {/* <div className="pro-tags">
                                        <div className="pro-tags-title">Tags:   </div>
                                        {productDet && productDet[0].get('brands') && productDet[0].get('sku') && productDet[0].get('model_number') ?
                                            <span style={{ color: 'black' }}>
                                                {productDet[0] && productDet[0].get('brands').get('name')} ,
                                              {productDet[0] && productDet[0].get('sku')},
                                              {productDet[0] && productDet[0].get('model_number')}
                                            </span>
                                            : <h6> Result Not Found</h6>}
                                    </div> */}
                                    <div className="share-box">
                                        <div className="title">Share in social media</div>

                                        <div className="socials-box"> <Link to="#"><i className="fa fa-facebook"></i></Link> <Link to="#"><i className="fa fa-twitter"></i></Link> <Link to="#"><i className="fa fa-google-plus"></i></Link> <Link to="#"><i className="fa fa-youtube"></i></Link> <Link to="#"><i className="fa fa-linkedin"></i></Link> <Link to="#"><i className="fa fa-instagram"></i></Link> </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="product-overview-tab">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="product-tab-inner">
                                            <ul id="product-detail-tab"
                                                className="nav nav-tabs product-tabs"
                                            >
                                                <li className="active">
                                                    <Link to="#" data-toggle="tab">
                                                        Description
                                                </Link>
                                                </li>
                                            </ul>
                                            <div id="productTabContent" className="tab-content">
                                                <div className="tab-pane in active" id="description">
                                                    <div className="std">
                                                        {
                                                            <div dangerouslySetInnerHTML={{ __html: productDet && productDet[0].get('longDescription') }}>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <ul
                                                id="product-detail-tab1" className="nav nav-tabs product-tabs"
                                            >
                                                <li className="active">
                                                    <Link data-toggle="tab">Reviews</Link>
                                                </li>
                                            </ul>
                                            <div id="productTabContent1" className="tab-content">
                                                <div id="reviews" className="tab-pane in active">
                                                    <div className="col-sm-5 col-lg-5 col-md-5">
                                                        <div className="reviews-content-left">
                                                            <h2>Customer Reviews</h2>

                                                            <ReviewRating />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-7 col-lg-7 col-md-7">
                                                        <div className="reviews-content-right">
                                                            <h2>Write Your Own Review</h2>
                                                            <h3>
                                                                You're reviewing: <span>{productDet && productDet[0].get('name')}</span>
                                                            </h3>
                                                            <AddReview />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {Array.isArray(productDet && productDet[0].get("frequentlyBoughtProducts")) && (productDet && productDet[0].get("frequentlyBoughtProducts").length) ?
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="frequently-bought-area">
                                <div className="page-header">
                                    <h2>Frequently Bought Together</h2>
                                </div>
                                <div className="row">
                                    {related && related.map((data, index) => {
                                        let lengthArr = related && related.length
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
                                            <>
                                                <div className="col-md-2">
                                                    <div className="f-b-a-img-div">
                                                        <img className="img-responsive f-b-a-img" src={imgSrc} alt={data.get('name')} />
                                                    </div>
                                                </div>
                                                {lengthArr - 1 == index ? '' : <div className="d-flex-center">
                                                    <i className="fa fa-plus f-b-a-plus"></i>
                                                </div>}
                                            </>

                                        )
                                    })}
                                    <div className="col-md-3">
                                        <div className="price_tag">
                                            <h4 className="font-weight-bold">
                                                <span>Total Price:</span><span className="color-main"> {currencySign} {relatedItemsPrice && relatedItemsPrice}</span>
                                            </h4>
                                            <button className="button submit mb-3 add_to_cart" onClick={() => { frequntilyBoughtProducts(related && related, true, false); }} title="Submit Review" type="submit">
                                                <span>
                                                    <i className="fa fa-shopping-basket" ></i>&nbsp;Add to Cart</span>
                                            </button>
                                            <br />
                                            <button className="button buy_now" title="BUY NOW" onClick={() => frequntilyBoughtProducts(related && related, false, true)} type="button">
                                                <i className="icon-basket-loaded icons"> </i><span>  BUY NOW </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row f-b-a-checkboxes">
                                    {secondRelatedData && secondRelatedData.map((data, index) => {
                                        return (
                                            <div className="col-md-12 mb-3">
                                                <input type="checkbox" name={index} defaultChecked={true} id={index} onChange={(e) => {
                                                    handleFrquentItemToggle(e, data)
                                                }} name="" />
                                                <label for={index}>
                                                    <span className="font-weight-bold">This Item:</span>{data.get('name')}<span className="color-main"> {currencySign}  {data.get("suggestedRetailPrice")}</span>
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="related-product-area">
                            <div className="page-header">
                                <h2>Related Products</h2>
                            </div>
                            <div className="related-products-pro">
                                {relatedProduct && relatedProduct.length >= 4 ?
                                    <SectionCarousel>
                                        {relatedProduct && relatedProduct.map((data) => {
                                            if (data.get('name')) {
                                                let StockIn = data.get('qty');
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
                                                                            <img className="first-img" src={imgSrc} alt={data.get("name")} />
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
                                                                        <Link title={data.get("name")} to={`/product/${data.get("name")}`}> {data.get("name")}
                                                                        </Link>
                                                                    </div>
                                                                    <div className="item-content">

                                                                        {renderProductRatingStars(data.get('rating'))}
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
                                                                                    // handle(data.id, false, true, false)
                                                                                    frequntilyBoughtProducts(related && related, true, false);
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
                                    : <h1>Result Not Found</h1>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="upsell-product-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-header">
                                <h2>On Sale Products</h2>
                            </div>
                            <div className="slider-items-products">
                                <SectionCarousel>
                                    {sellProducts && sellProducts.map((data) => {
                                        if (data.get('name')) {
                                            let StockIn = data.get('qty')
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
                                                <div key={data.id} className="product-item parent">
                                                    <div className="item-inner">
                                                        <div className="product-thumbnail">
                                                            {data.get('isNew') === true
                                                                ? <div className="icon-new-label new-right">New</div>
                                                                : null}
                                                            {data.get('isFeaturedOffer') === true
                                                                ? <div className="ribbon">Featured</div>
                                                                : null}
                                                            {data.get('onSale') === true
                                                                ? <div className="icon-sale-label sale-right">Sale</div>
                                                                : null}
                                                            <div className="pr-img-area">
                                                                <Link title={data.get("name")} to={`/product/${data.get("slug")}`}>
                                                                    <figure className="img-div">
                                                                        <img className="first-img custom-height img-fulid" src={imgSrc} alt="Sales Products" />
                                                                        <img className="hover-img" src={imgSrc} alt="Sales Products" />
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
                                                                    <Link title={data.get("name")} to={`/product/${data.get("slug")}`}> {data.get("name")}
                                                                    </Link>
                                                                </div>
                                                                <div className="item-content">
                                                                    {renderProductRatingStars(data.get('rating'))}
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Product_detail