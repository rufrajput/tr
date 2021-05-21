import React, { useState, useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { Parse } from "parse";
import RoutingHistory from '../../RoutingHistory';
import { OrderContext } from '../../contextapi/order_context';
// import { LoginContext } from '../../contextapi/LoginContext';
import { BillingContext } from '../../contextapi/BillingContext';
import { CartContext } from '../../contextapi/context_cart';
import { LoginContext } from '../../contextapi/LoginContext';
import { Form, Select } from 'antd';

const BillingInfo = () => {

  const { item } = useContext(CartContext);
  const [currencySign, setCurrencySign] = useState();
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);

  const { addBillingInfo, BillingInfo, addShippingType } = useContext(BillingContext);

  const [firstName, setFirstName] = useState(BillingInfo.firstName);
  const [lastName, setLastName] = useState(BillingInfo.lastName);
  const [email, setEmail] = useState(BillingInfo.email);
  const [Address, setAddress] = useState(BillingInfo.Address);
  const [country, setCountry] = useState(BillingInfo.selectedCountry);
  const [selectedCountry, setSelectedCountry] = useState();
  const [region, setRegion] = useState(BillingInfo.selectedRegion);
  const [selectedRegion, setSelectedRegion] = useState();
  const [province, setProvince] = useState(BillingInfo.selectedProvince);
  const [selectedProvince, setSelectedProvince] = useState();
  const [city, setCity] = useState(BillingInfo.selectedCity);
  const [selectedCity, setSelectedCity] = useState();
  const [barangay, setBarangay] = useState(BillingInfo.selectedBarangay);
  const [selectedBarangay, setSelectedBarangay] = useState();
  const [zipcode, setZipCode] = useState(BillingInfo.zipcode);
  const [phone, setPhone] = useState(BillingInfo.phone);
  const { register, handleSubmit, errors } = useForm();
  const { custmerGuest } = useContext(LoginContext);
  const { setBilling } = useContext(OrderContext);
  const [countryName, setCountryName] = useState();
  const [regionName, setRegionName] = useState();
  const [provinceName, setProvinceName] = useState();
  const [cityName, setCityName] = useState();
  const [barangayName, setBarangayName] = useState();
  const [addressChoice, setAddressChoice] = useState(BillingInfo.addressChoice);

  // const { custmerName, addUserName } = useContext(LoginContext);

  useEffect(() => {

    const Country = Parse.Object.extend('Country')
    const checkCountry = new Parse.Query(Country);
    checkCountry.limit(300)
    checkCountry.find().then(
      (result) => {
        setCountryName(result)
      }
    )

    const Extras = Parse.Object.extend('Extras');
    const query = new Parse.Query(Extras);
    query.limit(1);
    query.find().then((results) => {
      setCurrencySign(results[0].get("priceSymbol"))
    }, (error) => {
      console.error('Error while fetching Extras', error);
    });

  }, [])

  const onSubmit = data => {
    if (data) {
      const billingData = {
        firstName, lastName, zipcode, selectedCity, Address, phone,
        email, selectedCountry, addressChoice, selectedProvince,
        selectedBarangay, selectedRegion, country, region, province, city
      }
      addBillingInfo(billingData);
      setBilling(billingData);
    }
    if (!country) {
      alert("Please Select options from dropdown menu")
    }
    else {
      if (addressChoice === 'different address') {
        RoutingHistory.push('/shippinginfo')
      } else {
        if (addressChoice === 'this address') {
          RoutingHistory.push('/shippingmethod')
        }
      }
    }
  };
  const handleFirstName = (e) => {
    setFirstName(e.target.value)
  }
  const handleLastName = (e) => {
    setLastName(e.target.value)
  }
  const handlePhone = (e) => {
    setPhone(parseInt(e.target.value))
  }
  const handleAddress = (e) => {
    setAddress(e.target.value)
  }

  const handleZipCode = (e) => {
    setZipCode(parseInt(e.target.value))
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleCountry = (e) => {
    for (const countryObj of countryName) {
      if (e.target.value === countryObj.id) {
        setSelectedCountry(countryObj.get('name'));
      }
    }
    setCountry(e.target.value)
    setSelectedRegion()
    setSelectedProvince()
    setSelectedCity()
    setSelectedBarangay()
    const Region = Parse.Object.extend('Region')
    const checkRegion = new Parse.Query(Region);
    checkRegion.matches('countryId', e.target.value);
    checkRegion.find().then(
      (result) => {
        setRegionName(result)
      }
    )
  }

  const handleRegion = (e) => {
    for (const RegionObj of regionName) {
      if (e.target.value === RegionObj.id) {
        setSelectedRegion(RegionObj.get('region'));
      }
    }
    setRegion(e.target.value)
    const Provinces = Parse.Object.extend('Provinces')
    const checkProvinces = new Parse.Query(Provinces);
    checkProvinces.matches('regionId', e.target.value);
    checkProvinces.find().then(
      (result) => {
        setProvinceName(result)
      }
    )
  }
  const handleProvince = (e) => {
    for (const ProvinceObj of provinceName) {
      if (e.target.value === ProvinceObj.id) {
        setSelectedProvince(ProvinceObj.get('state'));
      }
    }
    setProvince(e.target.value)
    const City = Parse.Object.extend('City')
    const checkCity = new Parse.Query(City);
    checkCity.matches('provinceId', e.target.value);
    checkCity.find().then(
      (result) => {
        setCityName(result)
      }
    )
  }
  const handleCity = (e) => {
    for (const CityObj of cityName) {
      if (e.target.value === CityObj.id) {
        setSelectedCity(CityObj.get('cityName'));
      }
    }
    setCity(e.target.value)
    const Barangay = Parse.Object.extend('Barangay')
    const checkBarangay = new Parse.Query(Barangay);
    checkBarangay.matches('cityId', e.target.value);
    checkBarangay.find().then(
      (result) => {
        setBarangayName(result)
      }
    )
  }
  const handleBrangay = (e) => {
    for (const BarangayObj of barangayName) {
      if (e.target.value === BarangayObj.id) {
        setSelectedBarangay(BarangayObj.get('barangayName'));
      }
    }
    setBarangay(e.target.value)
  }
  const shippingAddress = (e) => {
    setAddressChoice(e.target.value)
    addShippingType(e.target.value)
    console.log('value is ', e.target.value)
  }
  return (
    <>
    { subTotal !== 0 ?
      <section className="main-container col2-right-layout">
        {custmerGuest === 'Guest' ? <div className="main container">
          <div className="col-main">
            <div className="row">
              <div className="col-md-7">
                <div className="page-title">
                  <h1>Billing Information</h1>
                </div>
                <br />
                <div className="box-border">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <ul>
                      {/* <div className="row">
                      <div className="col-sm-6">
                        <select value={shippingType} className="input form-control" name="" onChange={handleShippingPickUp} ref={register({
                          required: {
                            value: true,
                            message: "You must choose one option from below"
                          }
                        })}>
                          <option value="Local Shipping">Local Shipping</option>
                          <option value="Office Pickup">Office Pickup</option>
                        </select>
                        {errors.country && (
                          <div style={{ color: 'red' }} className="error">{errors.country.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12">
                        <select value={receviedType} onChange={handleShippingRecive} className="input form-control" name="" ref={register({
                          required: {
                            value: true,
                            message: "You must choose one option from below"
                          }
                        })}>
                          <option value="I am the Recipient">I am the Recipient</option>
                          <option value="Drop Shipping">Drop Shipping</option>
                        </select>
                        {errors.country && (
                          <div style={{ color: 'red' }} className="error">{errors.country.message}</div>
                        )}
                      </div>
                    </div> */}
                      <div className="row">
                        <div className="col-sm-6">
                          <label for="first_name" className="required">First Name</label>
                          <input type="text"
                            className="input form-control"
                            name="first_name"
                            value={firstName}
                            onChange={handleFirstName}
                            id="first_name" Í
                            ref={register({
                              required: {
                                value: true,
                                message: "You must enter your first name"
                              },
                              minLength: {
                                value: 3,
                                message: "Your name must be atleast 3 Characters"
                              }
                            })} />
                          {errors.first_name && (
                            <div style={{ color: 'red' }} className="error">{errors.first_name.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label for="last_name" className="required">Last Name</label>
                          <input type="text"
                            value={lastName}
                            name="last_name"
                            className="input form-control"
                            onChange={handleLastName}
                            id="last_name" ref={register({
                              required: {
                                value: true,
                                message: "You must enter your last name"
                              },
                              minLength: {
                                value: 3,
                                message: "Your name must be atleast 3 Characters"
                              }
                            })} />
                          {errors.last_name && (
                            <div style={{ color: 'red' }} className="error">{errors.last_name.message}</div>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-12">
                          <label for="email_address" className="required">Email Address</label>
                          <input type="text"
                            value={email}
                            className="input form-control"
                            name="email_address"
                            onChange={handleEmail}
                            id="email_address" ref={register({
                              required: {
                                value: true,
                                message: "You must enter your email"
                              },
                              pattern: {
                                value: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please use a valid email address'
                              }
                            })} />
                          {errors.email_address && (
                            <div style={{ color: 'red' }} className="error">{errors.email_address.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12">
                          <label for="address" className="required"> Street Address</label>
                          <input type="text" value={Address} className="input form-control" name="address" onChange={handleAddress} id="address" ref={register({
                            required: {
                              value: true,
                              message: "You must enter your address"
                            }
                          })} />
                          {errors.address && (
                            <div style={{ color: 'red' }} className="error">{errors.address.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label className="required">Country</label>

                          <select className="input form-control" name="country" value={country} onChange={handleCountry} ref={register({
                            required: {
                              value: true,
                              message: "You must choose one option from below"
                            }
                          })}>
                            <option selected="selected">Select Country
                          </option>
                            {countryName && countryName.map((data) => {
                              return (
                                <option value={data.id}>{data.get('name')}</option>
                              )
                            })}

                          </select>
                          {errors.country && (
                            <div style={{ color: 'red' }} className="error">{errors.country.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="required">Region</label>
                          <select className="input form-control" name="region" value={region} onChange={handleRegion} ref={register({
                             required: {
                              value: true,
                              message: "You must choose one option from below"
                            }
                          })}>
                            <option selected="selected">Select Region
                          </option>
                            {regionName && regionName.map((data) => {
                              return (
                                <option value={data.id}>{data.get('region')}</option>
                              )
                            })}
                          </select>
                          {errors.region && (
                            <div style={{ color: 'red' }} className="error">{errors.region.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <label className="required">State/Province</label>
                          <select className="input form-control" name="province" value={province} onChange={handleProvince} ref={register({
                            required: {
                              value: true,
                              message: "You must choose one option from below"
                            }
                          })}>
                            <option selected="selected">Select State/Province
                          </option>
                            {provinceName && provinceName.map((data) => {
                              return (
                                <option value={data.id}>{data.get('state')}</option>
                              )
                            })}
                          </select>
                          {errors.province && (
                            <div style={{ color: 'red' }} className="error">{errors.province.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label className="required">City</label>
                          <select className="input form-control" value={city} onChange={handleCity} name="city" ref={register({
                            required: {
                              value: true,
                              message: "You must choose one option from below"
                            }
                          })}>
                            <option selected="selected">Select City
                          </option>
                            {cityName && cityName.map((data) => {
                              return (
                                <option value={data.id}>{data.get('cityName')}</option>
                              )
                            })}
                          </select>
                          {errors.city && (
                            <div style={{ color: 'red' }} className="error">{errors.city.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label className="required">Barangay</label>
                          <select className="input form-control" name="barangay" value={barangay} onChange={handleBrangay} ref={register({
                            required: {
                              value: true,
                              message: "You must choose one option from below"
                            }
                          })}>
                            <option selected="selected">Select Barangay
                          </option>
                            {barangayName && barangayName.map((data) => {
                              return (
                                <option value={data.id}>{data.get('barangayName')}</option>
                              )
                            })}
                          </select>
                          {errors.barangay && (
                            <div style={{ color: 'red' }} className="error">{errors.barangay.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <label for="postal_code" className="required">Zip/Postal Code</label>
                          <input className="input form-control" value={zipcode} type="number" name="postal_code" id="postal_code" onChange={handleZipCode} ref={register({
                            required: {
                              value: true,
                              message: "You must enter your zip code"
                            },
                          })} />
                          {errors.postal_code && (
                            <div style={{ color: 'red' }} className="error">{errors.postal_code.message}</div>
                          )}
                        </div>
                        <div className="col-sm-6">
                          <label for="contact" className="required">Phone Number</label>
                          <input className="input form-control" type="number" value={phone} name="contact" id="contact" onChange={handlePhone} ref={register({
                            required: {
                              value: true,
                              message: "You must enter your Phone Number"
                            },
                          })} />
                          {errors.contact && (
                            <div style={{ color: 'red' }} className="error">{errors.contact.message}</div>
                          )}
                        </div>
                      </div>
                      <br />
                      <ul>
                        <label>
                          <input type="radio" value="this address" name="addressChoiceRadio" onChange={(e) => shippingAddress(e)} required style={{ marginRight: '4px' }} />
                                Ship To This Address</label>
                        <br />
                        <label>
                          <input type="radio" value="different address" name="addressChoiceRadio" onChange={(e) => setAddressChoice(e.target.value)} required style={{ marginRight: '4px' }} />
                                Ship To Different Address</label>
                      </ul>
                      <br />
                      <div className="cart_navigation"> <Link className="continue-btn" to="/checkout"><i className="fa fa-arrow-left"> </i>&nbsp; Back to Cart</Link>

                        <button type="submit" className="button pull-right"><i className="fa fa-angle-double-right"></i><span>Continue</span></button>
                      </div>
                    </ul>
                  </form>
                </div>
              </div>
              <div className="col-md-5 ">
                <div className="page-title">
                  <h1>Order Summary</h1>
                </div>
                <br />
                <div className="shipping_cart">
                  {item && item.map((data) => (
                    <div className="row product_detail">
                      <div className="col-md-3">
                        <div className="product_image">
                          <img src={data.img} alt="Product" />
                          <span className="badge badge-secondary">{data.qty}</span>
                        </div>
                      </div>
                      <div className="col-md-6 p-0">
                        <span className="product_description">{data.name}</span>
                      </div>
                      <div className="col-md-3">
                        <span className="product_price">{currencySign} {data.price * data.qty}</span>
                      </div>
                    </div>
                  ))}
                  <hr />
                  <div className="row">
                    <div className="col-md-8" >
                      <input className="w-100" type="text" placeholder="Gift card or discount code" />
                    </div>
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-default">Apply</button>
                    </div>
                  </div>
                  <hr />
                  <div className="row form-group">
                    <div className="col-md-12">
                      <label for="" className="col-md-6 col-form-label">Subtotal:</label>
                      <label for="" className="col-md-6 text-right col-form-label">
                        <strong> {currencySign} {subTotal} </strong>
                      </label>
                    </div>
                  </div>
                  <hr />
                  <div className="row form-group">
                    <div className="col-md-12">
                      <label for="" className="col-md-6 col-form-label">Total:</label>
                      <label for="" className="col-md-6 text-right col-form-label">
                        <strong>{currencySign} {subTotal}</strong>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : RoutingHistory.push('/')}
      </section >
      :  RoutingHistory.push('/')}
    </>
  )
}
export default BillingInfo;