import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import paymaya from 'paymaya-js-sdk';
import { CartContext } from '../../contextapi/context_cart';
import Error from '../../Pages/Sections/404Page';
import { Parse } from "parse";
import { OrderContext } from '../../contextapi/order_context';
import { LoginContext } from '../../contextapi/LoginContext';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { handlePayment } from '../utils/Payment/Paymaya';
import { isNullAndEmpty, isEmptyObject } from '../utils/EmptyObject';
import RoutingHistory from "../../RoutingHistory";

const OrderReview = () => {

  const { item, removeItem, userComment, incrementItem, decrementItem } = useContext(CartContext);
  const { billingData, shippingData } = useContext(OrderContext);
  const [orderNumber, setOrderNumber] = useState();
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [currencySign, setCurrencySign] = useState();
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);
  const { custmerName } = useContext(LoginContext);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const [mainBranchId, setMainBranchId] = useState();
  // const [latestOrder, setLatestOrder] = useState();
  // const [savedBilling, setSavedBilling] = useState();
  // const [savedShipping, setSavedShipping] = useState();
  // const [userInfo, setUserInfo] = useState();
  const [refrenceId, setRefrenceId] = useState();
  const [selectedMopID, setSelectedMopID] = useState();
  const [quantityCheck, setQuantityCheck] = useState([])

  const { option } = useParams();

  useEffect(() => {

    paymaya.init('pk-yaj6GVzYkce52R193RIWpuRR5tTZKqzBWsUeCkP9EAf', true);

    // const PaymentInformation = Parse.Object.extend('PaymentInformation');
    // const paymentInformationQuery = new Parse.Query(PaymentInformation);
    // paymentInformationQuery.find().then((res) => {
    //   console.log('mopType res: ', res);
    //   const allMOP = res.map((type, index) => {
    //     if (type.get('mopType')) {
    //       console.log(type.get('mopType'))
    //       const mop = type.get('mopType').split(" ").join("-").toLowerCase();
    //       return { id: index, type: mop };
    //     }
    //   })
    //   console.log('allmop: ', allMOP);
    //   const selectedMop = allMOP.find(mop => mop.type === option);
    //   setSelectedMopID(selectedMop.id);
    //   // Match selected mop with these mops
    // }, (err) => {
    //   console.error('Failed to fetch data from paymetinformation: ', err);
    // })

    const LatestOrder = Parse.Object.extend("Order");
    const latestorder = new Parse.Query(LatestOrder);
    latestorder.descending('createdAt');
    latestorder.notEqualTo('refrenceId', null)
    latestorder.limit(1);
    latestorder.find().then((result => {
      // setLatestOrder(result)
      let refId;
      if (result[0] && result[0].get('refrenceId')) {
        refId = parseInt(result[0].get('refrenceId')) + 1;
      }
      else {
        refId = 1;
      }
      setRefrenceId(refId);
    }), err => {
      alert("Latest Order Not Found", err.message)
    })
    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });
    getMainBranch().then(result => setMainBranchId(result))

  }, []);


  // Check Quantity
  const QuantityChecked = () => {
    console.log('QuantityChecked')
    const itemsQtyArr = item.filter(data => data.qty > data.dbQuantity);
    if (itemsQtyArr.length === 0) {
      OrderPlace(false)
    }
    else {
      setQuantityCheck(itemsQtyArr)
      setShow(true)
    }
  }

  const handlePayNow = () => {
    OrderPlace(true);
  }

  const getMainBranch = () => {
    let mainBranchId;
    return new Promise((resolve, reject) => {
      const Branch = Parse.Object.extend('Branch');
      const query = new Parse.Query(Branch);
      query.equalTo('name', 'main');
      query.find().then((res => {
        mainBranchId = res[0].id
        resolve(mainBranchId)
      }));
    })

  }
  const matchCityBranch = async (addressData) => {
    console.log("Address Data", addressData)
    return new Promise((resolve, reject) => {
      const Branch = Parse.Object.extend('Branch');
      const cityBranchQuery = new Parse.Query(Branch);
      console.log('given country: ', addressData.country);
      console.log('given regionId: ', addressData.region);
      console.log('given provinceId: ', addressData.province);

      cityBranchQuery.matches('country', addressData.country);
      cityBranchQuery.matches('regionId', addressData.region);
      cityBranchQuery.matches('provinceId', addressData.province);
      cityBranchQuery.find().then(cityArr => {
        console.log('cityArr: ', cityArr);
        if (cityArr.length !== 0) {
          let isCityMatched = false;
          let cityBranchId;
          for (let city of cityArr) {
            for (let cityID of city.get('city')) {
              if (cityID === addressData.city) {
                isCityMatched = true;
                cityBranchId = city.id;
              }
            }
          }
          if (isCityMatched) {
            console.log('matchCityBranch(): branch found in specified city');
            resolve(cityBranchId);
          } else {
            console.log('matchCityBranch(): branch not found in specified city. MainBranch assigned');
            resolve(mainBranchId);
            // reject(new Error('Branch not found in given city'));
          }
        }
        else {
          console.log('matchCityBranch(): city not found in specified province, region');
          resolve(mainBranchId);
          // reject(new Error('No city with branch found in specified country, region or province'));
        }
      },
        (err) => {
          console.log('matchCityBranch() no address attribute matched: ', err);
          resolve(mainBranchId);
          // reject(err);
        })
    })
  }
  const matchBranchInventory = (items, branchId) => {
    return new Promise(async (resolve, reject) => {
      const BranchInventory = Parse.Object.extend('BranchInventory');
      const branchQuery = new Parse.Query(BranchInventory);
      let availableProductsInBranch = 0;

      let matchedInventoryBranchResults;
      for (let product of items) {
        branchQuery.matches('product', product.id);
        branchQuery.matches('branch', branchId);
        branchQuery.greaterThanOrEqualTo('quantity', product.qty);
        try {
          matchedInventoryBranchResults = await branchQuery.find()
          if (matchedInventoryBranchResults && matchedInventoryBranchResults.length > 0) {
            availableProductsInBranch += 1;
          }
        }
        catch (err) {
          console.error('matchBranchInventory() query not executed: ', err);
          reject(err);
        }
      }
      if (matchedInventoryBranchResults && availableProductsInBranch !== item.length) {
        console.log('matchBranchInventory(): some products or their quantity is less than the ordered');
        resolve(mainBranchId);
      }
      else {
        console.log('matchBranchInventory(): inventory matched with all specified attributes');
        resolve(branchId);
      }
    })
  }
  const matchBranch = async () => {
    console.log('matchBranch billingData: ', billingData);
    console.log('matchBranch shippingData: ', shippingData);

    return new Promise((resolve, reject) => {
      if (!isNullAndEmpty(shippingData) && !isNullAndEmpty(billingData)) {
        console.log('if shippingData && billingData: ', billingData);
        matchCityBranch(billingData)
          .then(async cityBranch => {
            if (cityBranch !== mainBranchId) {
              // if branch exists in specified city
              try {
                const matchedInventoryBranchId = await matchBranchInventory(item, cityBranch);
                resolve(matchedInventoryBranchId);
              }
              catch (err) {
                resolve(mainBranchId)
              }
            }
            else {
              resolve(mainBranchId)
            }
          }, (error) => resolve(mainBranchId));
      }
      else if (!isNullAndEmpty(shippingData)) {
        matchCityBranch(shippingData)
          .then(async cityBranch => {
            if (cityBranch !== mainBranchId) {
              // if branch exists in specified city
              try {
                const matchedInventoryBranchId = await matchBranchInventory(item, cityBranch);
                resolve(matchedInventoryBranchId);
              }
              catch (err) {
                resolve(mainBranchId)
              }
            }
            else {
              resolve(mainBranchId)
            }
          }, (error) => resolve(mainBranchId));
      }
      else if (!isNullAndEmpty(billingData)) {
        matchCityBranch(billingData)
          .then(async cityBranch => {
            if (cityBranch !== mainBranchId) {
              // if branch exists in specified city
              try {
                const matchedInventoryBranchId = await matchBranchInventory(item, cityBranch);
                resolve(matchedInventoryBranchId);
              }
              catch (err) {
                resolve(mainBranchId)
              }
            }
            else {
              resolve(mainBranchId)
            }
          }, (error) => {
            resolve(mainBranchId)
          });
      }
      else {
        reject(new Error('Shipping and Billing information not provided'));
      }
    })

  }
  const saveBilling = () => {
    return new Promise((resolve, reject) => {
      if (!isEmptyObject(billingData)) {
        const Billing = Parse.Object.extend("BillingInfo");
        const billing = new Billing();
        billing.set("firstName", billingData.firstName);
        billing.set("lastName", billingData.lastName);
        billing.set("email", billingData.email);
        billing.set("address", billingData.address);
        billing.set("country", billingData.selectedCountry);
        billing.set("region", billingData.selectedRegion);
        billing.set("province", billingData.selectedProvince);
        billing.set("city", billingData.selectedCity);
        billing.set("barangay", billingData.selectedBarangay);
        billing.set("zip", billingData.zipcode);
        billing.set("phone", billingData.phone);
        if (custmerName) {
          billing.set("user", { "__type": "Pointer", "className": "_User", "objectId": custmerName.id })
        }
        billing.save()
          .then((object) => {
            console.debug('billingInfo saved in db');
            // setSavedBilling(object);
            resolve(object);
          }, (error) => {
            // Save fails
            alert('Failed to create new billing object, with error code: ' + error.message);
            reject(error)
          });
      }
      else {
        const Billing = Parse.Object.extend("BillingInfo");
        const billing = new Billing();
        billing.set("firstName", shippingData.editFirstName);
        billing.set("lastName", shippingData.editLastName);
        billing.set("email", shippingData.editEmail);
        billing.set("address", shippingData.editAddress);
        billing.set("country", shippingData.selectedCountry);
        billing.set("region", shippingData.selectedRegion);
        billing.set("province", shippingData.selectedProvince);
        billing.set("city", shippingData.selectedCity);
        billing.set("barangay", shippingData.selectedBarangay);
        billing.set("zip", shippingData.editZip);
        billing.set("phone", shippingData.editPhone);
        billing.set("ShippingType", shippingData.shippingType);
        billing.set("Received", shippingData.pikupDetail);
        if (custmerName) {
          billing.set("user", { "__type": "Pointer", "className": "_User", "objectId": custmerName.id })
        }
        billing.save()
          .then((object) => {
            console.debug('billingInfo saved in db');
            // setSavedBilling(object);
            resolve(object);
          }, (error) => {
            // Save fails
            alert('Failed to create new billing object, with error code: ' + error.message);
            reject(error)
          });
      }
    })
  }
  const saveShipping = () => {
    return new Promise((resolve, reject) => {
      if (!isEmptyObject(shippingData)) {
        if (shippingData.pikupDetail === 'Office Pickup') {
          const Shipping = Parse.Object.extend("ShippingInfo");
          const shipping = new Shipping();
          shipping.set("firstName", shippingData.editFirstName);
          shipping.set("lastName", shippingData.editLastName);
          shipping.set("email", shippingData.editEmail);
          shipping.set("country", shippingData.selectedCountry);
          shipping.set("pickupType", shippingData.pikupDetail);
          if (custmerName.id) {
            shipping.set("user", { "__type": "Pointer", "className": "_User", "objectId": custmerName.id })
          }
          shipping.save()
            .then((object) => {
              console.debug('shippingInfo saved in db');
              // setSavedShipping(object);
              resolve(object)
            }, (error) => {
              alert('Failed to create new shipping object, with error code: ' + error.message);
              console.error('Failed to create new shipping object, with error code: ' + error.message);
              reject(error);
            });
        } else {
          const Shipping = Parse.Object.extend("ShippingInfo");
          const shipping = new Shipping();
          shipping.set("firstName", shippingData.editFirstName);
          shipping.set("lastName", shippingData.editLastName);
          shipping.set("zip", shippingData.editZip);
          shipping.set("city", shippingData.selectedCity);
          shipping.set("address", shippingData.editAddress);
          shipping.set("phone", shippingData.editPhone);
          shipping.set("region", shippingData.selectedRegion);
          shipping.set("email", shippingData.editEmail);
          shipping.set("country", shippingData.selectedCountry);
          shipping.set("province", shippingData.selectedProvince);
          shipping.set("barangay", shippingData.selectedBarangay);
          shipping.set("shippingType", shippingData.shippingType);
          shipping.set("pickupType", shippingData.pikupDetail);
          if (custmerName) {
            shipping.set("user", { "__type": "Pointer", "className": "_User", "objectId": custmerName.id })
          }
          shipping.save()
            .then((object) => {
              console.debug('shippingInfo saved in db');
              // setSavedShipping(object);
              resolve(object)
            }, (error) => {
              alert('Failed to create new shipping object, with error code: ' + error.message);
              console.error('Failed to create new shipping object, with error code: ' + error.message);
              reject(error)
            });
        }
      }
      else {
        const Shipping = Parse.Object.extend("ShippingInfo");
        const shipping = new Shipping();
        shipping.set("firstName", billingData.editFirstName);
        shipping.set("lastName", billingData.editLastName);
        shipping.set("zip", billingData.editZip);
        shipping.set("city", billingData.selectedCity);
        shipping.set("address", billingData.editAddress);
        shipping.set("phone", billingData.editPhone);
        shipping.set("region", billingData.selectedRegion);
        shipping.set("email", billingData.editEmail);
        shipping.set("country", billingData.selectedCountry);
        shipping.set("province", billingData.selectedProvince);
        shipping.set("barangay", billingData.selectedBarangay);
        if (custmerName) {
          shipping.set("user", { "__type": "Pointer", "className": "_User", "objectId": custmerName.id })
        }
        shipping.save()
          .then((object) => {
            console.debug('shippingInfo saved in db');
            // setSavedShipping(object);
            resolve(object)
          }, (error) => {
            alert('Failed to create new shipping object, with error code: ' + error.message);
            console.error('Failed to create new shipping object, with error code: ' + error.message);
            reject(error)
          });
      }
    })
  }

  const OrderPlace = async (isPayNow) => {
    let paymentMethod;
    if (option === 'cash' || option === 'cod' || option === 'COD' || option === 'Cod') { paymentMethod = 'COD' }
    else if (option === 'card') { paymentMethod = 'Credit Card' }
    else { paymentMethod = 'NA' }
    try {
      let savedBilling = {};
      let savedShipping = {};

      savedBilling = await saveBilling();
      savedShipping = await saveShipping();

      if (!isEmptyObject(savedBilling) || !isEmptyObject(savedShipping)) {
        let branchId;
        try {
          branchId = await matchBranch();

          const Order = Parse.Object.extend("Order");
          const order = new Order();
          order.set("subTotal", subTotal);
          order.set('orderDate', new Date());
          order.set("paymentMethod", paymentMethod);
          order.set('refrenceId', refrenceId);
          order.set("orderedItems", item.map(i => ({ productId: i.id, productName: i.name, productPrice: i.price, quantity: i.qty })));
          order.set("status", "Pending");
          order.set("paymentStatus", "Unpaid");
          order.set("userComment", userComment);
          order.set("amount", subTotal);
          if (custmerName) {
            order.set('checkoutType', 'User')
            order.set('shipping_Info', { "__type": "Pointer", "className": "ShippingInfo", "objectId": savedShipping.id });
            order.set('billing_Info', { "__type": "Pointer", "className": "BillingInfo", "objectId": savedBilling.id });
            order.set("user", { "__type": "Pointer", "className": "_User", "objectId": custmerName.id })
            order.set('branchID', { "__type": "Pointer", "className": "Branch", "objectId": branchId });
          }
          else {
            order.set('checkoutType', 'Guest')
            order.set('billing_Info', { "__type": "Pointer", "className": "BillingInfo", "objectId": savedBilling.id });
            order.set('shipping_Info', {
              "__type": "Pointer", "className": "ShippingInfo", "objectId": savedShipping.id
            });
            order.set('branchID', { "__type": "Pointer", "className": "Branch", "objectId": branchId });
          }
          order.save()
            .then((object) => {
              setOrderNumber(object.id);
              if (isPayNow) {
                if (custmerName) {
                  console.log('inside if (custmerName)');
                  handlePayment(object.id, custmerName, savedBilling, savedShipping, item, subTotal);
                }
                else {
                  console.log('inside else (custmerName)');
                  handlePayment(object.id, undefined, savedBilling, savedShipping, item, subTotal);
                }
              }
              RoutingHistory.push(`/thankyou/${refrenceId}/${'cod'}`)
            }, (error) => {
              // Save fails
              alert('Failed to create new object, with error code: ' + error.message);
            });
        } catch (err) {
          console.error('No branch id found to assign: ', err);
          // branchId = mainBranch;
          // alert('No branch id found to assign');
        }
      }
      else {
        console.error('Saved billing and saved shipping both are empty');
      }
    }
    catch (error) {
      alert(error.message);
    }
  }

  const renderComponent = () => {
    if (option === 'credit-card' || option === 'card') {
      return (
        <section className="main-container col1-layout">
          { subTotal !== 0 ?
            <div className="main container">
              <div className="col-main">
                <div className="cart">
                  <div className="page-content page-order">
                    <div className="page-title">
                      <h1>Place Order</h1>
                    </div>
                    <div className="order-detail-content">
                      <div className="table-responsive">
                        <table className="table table-bordered cart_summary">
                          <thead>
                            <tr>
                              <th className="cart_product">Product</th>
                              <th>Name</th>
                              <th className="text_center">Unit price</th>
                              <th className="text_center">Qty</th>
                              <th className="text_center">Total</th>
                              <th className="action"><i className="fa fa-trash-o"></i></th>
                            </tr>
                          </thead>
                          <tbody>
                            {item && item.map((data) => (

                              <tr>
                                <td className="cart_product"><Link to={`/product-detail/${data.id}`}><img src={data.img} alt="Product" /></Link></td>
                                <td className="cart_description"><p className="product-name"><Link to="#">{data.name} </Link></p></td>
                                <td className="price"><span>{currencySign} {data.price}</span></td>
                                <td className="qty"><span>{data.qty}</span></td>
                                <td className="price"><span>{currencySign} {data.qty * data.price}</span></td>
                                <td className="action"><Link to="#" ><i className="icon-close" onClick={() => {
                                  removeItem(data.id)
                                }} ></i></Link></td>
                              </tr>
                            ))}
                            {/* <tr>
                      <td className="cart_product"><Link to="#"><img src="../images/products/product-1.jpg" alt="Product"/></Link></td>
                      <td className="cart_description"><p className="product-name"><Link to="#">Ipsums Dolors Untra </Link></p>
                        <small><Link to="#">Color : Green</Link></small>
                        <small><Link to="#">Size : XL</Link></small></td>
                      <td className="availability out-of-stock"><span className="label">No stock</span></td>
                      <td className="price"><span>$00.00</span></td>
                      <td className="qty"><input className="form-control input-sm" type="text" value="0"/></td>
                      <td className="price"><span>00.00</span></td>
                      <td className="action"><Link to="#"><i className="icon-close"></i></Link></td>
                    </tr>
                    <tr>
                      <td className="cart_product"><Link to="#"><img src="../images/products/product-1.jpg" alt="Product"/></Link></td>
                      <td className="cart_description"><p className="product-name"><Link to="#">Ipsums Dolors Untra </Link></p>
                        <small><Link to="#">Color : Blue</Link></small>
                        <small><Link to="#">Size : S</Link></small></td>
                      <td className="availability in-stock"><span className="label">In stock</span></td>
                      <td className="price"><span>$99.00</span></td>
                      <td className="qty"><input className="form-control input-sm" type="text" value="2"/></td>
                      <td className="price"><span>$188.00</span></td>
                      <td className="action"><Link to="#"><i className="icon-close"></i></Link></td>
                    </tr> */}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td className="cart_product"><strong>Sub Total</strong></td>
                              <td className="cart_description"></td>
                              <td className="price"><span></span></td>
                              <td className="qty"><span></span></td>
                              <td className="price"><span><strong>{currencySign} {subTotal} </strong></span></td>
                              <td className="action"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="cart_navigation"> <Link className="continue-btn" to="/paymentinfo"><i className="fa fa-arrow-left"> </i>&nbsp; Back</Link> <Link className="checkout-btn" style={{ cursor: 'pointer' }} onClick={handlePayNow} ><i className="fa fa-check"></i> Pay Now</Link> </div>
                    </div>
                  </div>
                </div>
              </div>
            </div >
            : RoutingHistory.push('/')}
        </section >
      )
    }
    else {
      if (option === 'Cash' || option === 'cash' || option === 'cod' || option === 'COD' || option === 'Cod') {
        return (
          <section className="main-container col1-layout">

<Modal size='lg' animation={false} show={show} onHide={handleClose}>
  <Modal.Header closeButton>
  Sorry, Quantity of following products is not available is Stock!!!
                Please update your order
  </Modal.Header>
    <Modal.Body>
    <div className="table-responsive">
                        <table className="table cart_summary text-center borderless">
                        <thead>
                                  <tr>
                                    <th className="cart_product">Product</th>
                                    <th>Name</th>
                                    <th className="text_center">Unit price</th>
                                    <th className="text_center">Qty</th>
                                    <th className="text_center">Total</th>
                                  </tr>
                                </thead>
                          <tbody>
                            {quantityCheck && quantityCheck.map((data) => (
                              <tr>
                                <td className="cart_product">
                                  <img src={data.img} alt={data.name} />
                                </td>
                                <td className="cart_description">
                                  <p className="product-name">{data.name}</p>
                                </td>
                                <td className="price"><span>{currencySign} {data.price}</span></td>
                                <td className="qty"><span>{data.qty}</span></td>
                                <td className="price"><span>{currencySign} {data.qty * data.price}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
    </Modal.Body>
</Modal>

            {/* <Modal size='lg' aria-labelledby="contained-modal-title-vcenter" centered className="pro_img_popup" animation={false} show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                Sorry, Quantity of following products is not available is Stock!!!
                Please update your order
                        </Modal.Header>
              <Modal.Body >
                <div className="row">
                  <div className="col-sm-8">
                    <div className="heading_light"> message</div>
                    <div className="">
                      <div className="table-responsive">
                        <table className="table cart_summary text-center borderless">
                          <tbody>
                            {quantityCheck && quantityCheck.map((data) => (
                              <tr>
                                <td className="cart_product">
                                  <img src={data.img} alt={data.name} />
                                </td>
                                <td className="cart_description">
                                  <p className="product-name">{data.name}</p>
                                </td>
                                <td className="price"><span>{currencySign} {data.price}</span></td>
                                <td className="qty"><span>{data.qty}</span></td>
                                <td className="price"><span>{currencySign} {data.qty * data.price}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal> */}

            {subTotal !== 0 ?
              <div className="main container">
                <div className="col-main">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="cart">
                        <div className="page-content page-order">
                          <div className="page-title">
                            <h1>Place Order</h1>
                          </div>
                          <div className="order-detail-content">
                            <div className="table-responsive">
                              <table className="table table-bordered cart_summary">
                                <thead>
                                  <tr>
                                    <th className="cart_product">Product</th>
                                    <th>Name</th>
                                    <th className="text_center">Unit price</th>
                                    <th className="text_center">Qty</th>
                                    <th className="text_center">Total</th>
                                    <th className="action"><i className="fa fa-trash-o"></i></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item && item.map((data) => (
                                    <tr>
                                      <td className="cart_product"><Link><img src={data.img} alt="Product" /></Link></td>
                                      <td className="cart_description"><p className="product-name"><Link to="#">{data.name} </Link></p></td>
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
                                      {/* <td className="qty"><span>{data.qty}</span></td> */}
                                      <td className="price"><span>{currencySign} {data.qty * data.price}</span></td>
                                      <td className="action"><Link to="#" ><i className="icon-close" onClick={() => {
                                        removeItem(data.id)
                                      }} ></i></Link></td>
                                    </tr>
                                  ))}
                                  {/* <tr>
                      <td className="cart_product"><Link to="#"><img src="../images/products/product-1.jpg" alt="Product"/></Link></td>
                      <td className="cart_description"><p className="product-name"><Link to="#">Ipsums Dolors Untra </Link></p>
                        <small><Link to="#">Color : Green</Link></small>
                        <small><Link to="#">Size : XL</Link></small></td>
                      <td className="availability out-of-stock"><span className="label">No stock</span></td>
                      <td className="price"><span>$00.00</span></td>
                      <td className="qty"><input className="form-control input-sm" type="text" value="0"/></td>
                      <td className="price"><span>00.00</span></td>
                      <td className="action"><Link to="#"><i className="icon-close"></i></Link></td>
                    </tr>
                    <tr>
                      <td className="cart_product"><Link to="#"><img src="../images/products/product-1.jpg" alt="Product"/></Link></td>
                      <td className="cart_description"><p className="product-name"><Link to="#">Ipsums Dolors Untra </Link></p>
                        <small><Link to="#">Color : Blue</Link></small>
                        <small><Link to="#">Size : S</Link></small></td>
                      <td className="availability in-stock"><span className="label">In stock</span></td>
                      <td className="price"><span>$99.00</span></td>
                      <td className="qty"><input className="form-control input-sm" type="text" value="2"/></td>
                      <td className="price"><span>$188.00</span></td>
                      <td className="action"><Link to="#"><i className="icon-close"></i></Link></td>
                    </tr> */}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td className="cart_product"><strong>Subtotal</strong></td>
                                    <td className="cart_description"></td>
                                    <td className="price"><span></span></td>
                                    <td className="qty"><span></span></td>
                                    <td className="price"><span><strong>{currencySign} {subTotal} </strong></span></td>
                                    <td className="action"></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>

                            <div className="cart_navigation">
                              <Link className="continue-btn" to="/paymentinfo">
                                <i className="fa fa-arrow-left"> </i>&nbsp; Back
                        </Link>
                              <Link onClick={QuantityChecked} className="checkout-btn" style={{ cursor: 'pointer' }} >
                                <i className="fa fa-check"></i> Place Order
                            </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : RoutingHistory.push('/')}
          </section>
        )

      }
      else {
        return <Error />
      }
    }
  }
  return (

    <>
      {renderComponent()}
    </>
  )
}

export default OrderReview;