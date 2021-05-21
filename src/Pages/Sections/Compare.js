import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Parse } from "parse";
import { useParams } from 'react-router-dom';
import { compareContext } from '../../contextapi/CompareListContext';
import { CartContext } from '../../contextapi/context_cart';
import { wishContext } from '../../contextapi/WishListContext';
import ModalCart from "../../Components/CartModal/ModalCart";
import { Modal } from 'react-bootstrap';
import { notification } from 'antd';
const Compare = () => {
  const { compare, removeToCompare } = useContext(compareContext);
  const [currencySign, setCurrencySign] = useState();
  const { removeItem } = useContext(CartContext);
  const { addToCart,item } = useContext(CartContext);
  const { addToWish } = useContext(wishContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [cartModalProp, setcartModalProp] = useState('');
  const [quickViewProp, setQuickViewProp] = useState('');
  const { compareProduct, setCompareProduct } = useState();
  const { id } = useParams();
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

    const CompareProducts = Parse.Object.extend('Products')
    const compareProducts = new Parse.Query(CompareProducts);
    compareProducts.equalTo('objectId', id);
    // compareProducts.include("brands");
    compareProducts.equalTo("isVisible", true);
    compareProducts.get(id).then(
      (result) => {
        setCompareProduct(result)
      }
    )

  }, [id]);

  //this is for global state
  const handle = (id, AddToCart) => {
    const Comparison = Parse.Object.extend('Products')
    const comparison = new Parse.Query(Comparison);
    comparison.include('image');
    comparison.include('brands')
    // setForUse(item[item_id)
    comparison.get(id).then(
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
          price: result.get('suggestedRetailPrice'),
          discription: result.get('longDescription')
        }
        if (AddToCart) {
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
          addToWish(obj)
        }
      }
    )
  }
  // const renderStockAvailabilty = () => {
  //   const productCount = compareProduct && compareProduct.get('count');
  //   if (productCount > 0) {
  //     return (
  //       <td className="instock">Instock </td>
  //     )
  //   }
  //   else {
  //     return (
  //       <td className="instock">Out of stock</td>
  //     )
  //   }
  // }

  //for toste alert
  const openToste = () => {
    notification.success({
      message: 'Item added to your Wishlist ',
    });
  };

  const handleQuick = (id, Bool) => {
    handle(id, Bool)
    setShow(true)
    setQuickViewProp(id)
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
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <ul>
                <li className="home"> <Link title="Go to Home Page" to='/'>Home</Link><span>&raquo;</span></li>
                <li><strong>Compare</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <section className="main-container col1-layout">
        <div className="main container">
          <div className="col-main">
            <div className="compare-list">
              <div className="page-title">
                <h2>Compare Products</h2>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-compare table-bordered">
                  <tr>
                    <td className="compare-label">Product Image</td>
                    {compare && compare.map((data) => <td className="compare-pro">
                      <Link href="#">
                        <img className='compare_image' src={data.img} alt="Product" />
                      </Link>
                    </td>)}
                  </tr>
                  <tr>
                    <td className="compare-label">Product Name</td>
                    {compare && compare.map((data) => <td className="">{data.name}</td>)}
                  </tr>
                  {/* <tr>
                    <td className="compare-label">Rating</td>
                            
                    <td><div className="rating"> <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star-o"></i> <i className="fa fa-star-o"></i> <i className="fa fa-star-o"></i>&nbsp; <span>(2 Reviews)</span></div></td>
                  </tr> */}
                  <tr>
                    <td className="compare-label">Price</td>
                    {compare && compare.map((data) => <td className="">{currencySign} {data.price}</td>)}
                  </tr>
                  <tr>
                    <td className="compare-label">Description</td>
                    {compareProduct && compareProduct.map((data)=>
                      <td className="">
                        {
                          <div dangerouslySetInnerHTML={{ __html: data.get('longDescription')}}>
                          </div>
                        }
                      </td>)}
                  </tr>
                  {/* <tr>
                    <td className="compare-label">Manufacturer</td>
                    {compare && compare.map((data) => <td className="compare-label">{data.brand}</td>)}
                  </tr> */}
                  {/* <tr>
                    <td className="compare-label">Availability</td>
                         {renderStockAvailabilty()}
                    <td className="instock">Instock (25 items)</td>
                    <td className="outofstock">Out of stock</td>
                    <td className="instock">Instock (30 items)</td>
                    <td className="instock">Instock (50 items)</td> 
                  </tr> */}
                  {/* <tr>
                    <td className="compare-label">Size</td>
                    <td>X</td>
                    <td>XL</td>
                    <td>XS</td>
                    <td>XX</td>
                  </tr>
                  <tr>
                    <td className="compare-label">Color</td>
                    <td>Red</td>
                    <td>Blue</td>
                    <td>Green</td>
                    <td>Lavender</td>
                  </tr> */}
                  <tr>
                    <td className="compare-label">Action</td>
                    {compare && compare.map((data) => {
                      let StockIn = data.dbQuantity
                      return (
                        <td className="action">
                          {StockIn > 0 ?
                            <button className="add-cart button button-sm" onClick={() => handleQuick(data.id, true)}><i className="fa fa-shopping-basket"></i></button>
                            : ''}
                          <button className="button button-sm" onClick={() => {
                            handle(data.id, false)
                            openToste()
                          }}>
                            <i className="fa fa-heart-o"></i></button>
                          <button className="button button-sm" onClick={() => {
                            removeToCompare(data.id)
                            removeItem(data.id)

                          }}>
                            <i className="fa fa-close"></i></button></td>
                      )
                    })}
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>




    </>
  )
}

export default Compare;