import React, { useState, useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { Parse } from "parse";
import RoutingHistory from '../../RoutingHistory';
import { OrderContext } from '../../contextapi/order_context';
import { LoginContext } from '../../contextapi/LoginContext';
import { CartContext } from '../../contextapi/context_cart';
import { isEmptyObject } from 'jquery';

const Shipping = () => {
  const { item } = useContext(CartContext);
  const [currencySign, setCurrencySign] = useState();
  const subTotal = item.reduce((total, curr) => (total + (curr.price * curr.qty)), 0);


  const [country, setCountry] = useState();
  const [selectedCountry, setSelectedCountry] = useState();
  const [region, setRegion] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [province, setProvince] = useState();
  const [selectedProvince, setSelectedProvince] = useState();
  const [city, setCity] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [barangay, setBarangay] = useState();
  const [selectedBarangay, setSelectedBarangay] = useState();
  const [countryName, setCountryName] = useState();
  const [regionName, setRegionName] = useState();
  const [provinceName, setProvinceName] = useState();
  const [cityName, setCityName] = useState();
  const [barangayName, setBarangayName] = useState();
  const { custmerName, custmerGuest, addUserName } = useContext(LoginContext);
  const [pikupDetail, setPikupDetail] = useState();
  const [pickerFirstName, setPickerFirstName] = useState();
  const [shippingType, setShippingType] = useState();
  const [pickerLastName, setPickerLastName] = useState();
  const [pickerEmail, setPickerEmail] = useState();
  const { register, handleSubmit, errors } = useForm();
  const { setShipping } = useContext(OrderContext)
  const [editFirstName, setEditFirstName] = useState();
  const [editLastName, setEditLastName] = useState();
  const [editEmail, setEditEmail] = useState();
  const [editZip, setEditZip] = useState();
  const [editPhone, setEditPhone] = useState();
  const [editAddress, setEditAddress] = useState();

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
    if (custmerName && custmerName.get('address').id !== "undefined") {
      let userCountryId;
      let userRegionId;
      let userProvinceId;
      let userCityId;
      const UserAddress = Parse.Object.extend('_User');
      const useraddress = new Parse.Query(UserAddress);
      useraddress.include('address');
      useraddress.get(Parse.User.current().id).then((results) => {
        setEditFirstName(results.get('first_name'));
        setEditLastName(results.get('last_name'))
        setEditPhone(results.get('phone'))
        setEditEmail(results.get('email'))
        let DataGetting = results.get('address').id
        const GetData = Parse.Object.extend('UserAddress');
        const dataget = new Parse.Query(GetData);
        dataget.include("city");
        dataget.include("country");
        dataget.include('province')
        dataget.include('barangay')
        dataget.include('region')
        dataget.get(DataGetting).then((res) => {
          setEditZip(res.get('zipCode'))
          setEditAddress(res.get('address'))
          if (res.get('country')) {
            let userCountry = res.get('country').id
            const getCountry = Parse.Object.extend('Country');
            const countrygetting = new Parse.Query(getCountry);
            countrygetting.get(userCountry).then((count) => {
              setCountry(count.id);
              setSelectedCountry(count.get('name'))
              userCountryId = count.id;
              const Region = Parse.Object.extend('Region')
              const checkRegion = new Parse.Query(Region);
              checkRegion.matches('countryId', userCountryId);
              checkRegion.find().then(
                (result) => {
                  setRegionName(result)
                }
              )
            }, (err) => {
              console.log('No Country Found', err.message)
            })
          }
          if (res.get('region')) {
            let userRegion = res.get('region').id
            const getRegion = Parse.Object.extend('Region');
            const regiongetting = new Parse.Query(getRegion);
            regiongetting.get(userRegion).then((reg) => {
              setRegion(reg.id)
              setSelectedRegion(reg.get('region'))
              userRegionId = reg.id;
              const Provinces = Parse.Object.extend('Provinces')
              const checkProvinces = new Parse.Query(Provinces);
              checkProvinces.matches('regionId', userRegionId);
              checkProvinces.find().then(
                (result) => {
                  setProvinceName(result)
                }
              )
            }, (err) => {
              console.log('No Region Found', err.message)
            })
          }
          if (res.get('province')) {
            let userProvince = res.get('province').id
            const getProvince = Parse.Object.extend('Provinces');
            const provincegetting = new Parse.Query(getProvince);
            provincegetting.get(userProvince).then((pro) => {
              setProvince(pro.id)
              setSelectedProvince(pro.get('state'))
              userProvinceId = pro.id
              const City = Parse.Object.extend('City')
              const checkCity = new Parse.Query(City);
              checkCity.matches('provinceId', userProvinceId);
              checkCity.find().then(
                (result) => {
                  setCityName(result)
                }
              )
            }, (err) => {
              console.log('No Province/State Found', err.message)
            })
          }
          if (res.get('city')) {
            let userCity = res.get('city').id
            const getCity = Parse.Object.extend('City');
            const citygetting = new Parse.Query(getCity);
            citygetting.get(userCity).then((cit) => {
              setCity(cit.id)
              setSelectedCity(cit.get('cityName'))
              userCityId = cit.id
              const Barangay = Parse.Object.extend('Barangay')
              const checkBarangay = new Parse.Query(Barangay);
              checkBarangay.matches('cityId', userCityId);
              checkBarangay.find().then(
                (result) => {
                  setBarangayName(result)
                }
              )
            }, (err) => {
              console.log('No City Found', err.message)
            })
          }
          if (res.get('barangay')) {
            let userBarangay = res.get('barangay').id
            const getBarangay = Parse.Object.extend('Barangay');
            const barangaygetting = new Parse.Query(getBarangay);
            barangaygetting.get(userBarangay).then((bar) => {
              setBarangay(bar.id)
              setSelectedBarangay(bar.get('barangayName'))
            }, (err) => {
              console.log('No Barangay Found', err.message)
            })
          }
        })
      }, (error) => {
        console.error('Error while fetching Order', error);
      });
    }

  }, [])

  const onSubmit = data => {
    if (data) {
      const shippingData = {
        editFirstName, editLastName, editZip, selectedCity, editAddress, editPhone,
        editEmail, selectedCountry, shippingType, selectedProvince,
        selectedBarangay, selectedRegion, pikupDetail, pickerFirstName,
        pickerLastName, pickerEmail, country, region, province, city
      }
      setShipping(shippingData);

    }
  
       if(!pikupDetail){
         alert("Please Select PickUp Type ")
       }
       else{
         if(!shippingType){
           alert("Please Select Shipping Type ")
         }
         else{
           if(!country){
             alert("Please atleast Select your country for dropdown options ")
           }
           else{
            if (pikupDetail === 'Office Pickup') {
              RoutingHistory.push('/shippingmethod')
            }
            else {
              RoutingHistory.push('/shippingmethod')
            }
           }
         }
       }
   
    if (custmerName && custmerName.get("name") !== null) {
      return CheckedUserAddress()
    }
  };

  const CheckedUserAddress = () => {

    if (custmerName && custmerName.get("address").id === "undefined") {
      const addAddress = Parse.Object.extend("UserAddress");
      const addingaddress = new addAddress();
      addingaddress.set('address', editAddress)
      addingaddress.set('zipCode', editZip)
      addingaddress.set("country", { "__type": "Pointer", "className": "Country", "objectId": country })
      addingaddress.set("city", { "__type": "Pointer", "className": "City", "objectId": city })
      addingaddress.set("barangay", { "__type": "Pointer", "className": "Barangay", "objectId": barangay })
      addingaddress.set("province", { "__type": "Pointer", "className": "Provinces", "objectId": province })
      addingaddress.set("region", { "__type": "Pointer", "className": "Region", "objectId": region })
      addingaddress.save().then((useraddress) => {
        let userAddressAdding = useraddress
        const User = new Parse.User();
        const query = new Parse.Query(User);
        query.get(custmerName.id).then((user) => {
          user.set('address', userAddressAdding);
          user.save().then((res) => {
            addUserName(res)
          }).catch((err) => {
            console.log("User not updated", err.message)
          })
        }).catch((error) => {
          console.log("user Not Found", error.message)
        })
      }).catch((error) => {
        console.log('Error While updating user', error);
      })
    }

  }

  const handleFirstName = (e) => {
    setEditFirstName(e.target.value)
  }
  const handleLastName = (e) => {
    setEditLastName(e.target.value)
  }
  const handlePhone = (e) => {
    setEditPhone(parseInt(e.target.value))
  }
  const handleAddress = (e) => {
    setEditAddress(e.target.value)
  }
  const handleZipCode = (e) => {
    setEditZip(parseInt(e.target.value))
  }
  const handleEmail = (e) => {
    setEditEmail(e.target.value)
  }
  const handleShippingPickUp = (e) => {
    setPikupDetail(e.target.value)
  }
  const handleShippingType = (e) => {
    setShippingType(e.target.value);
  }
  const handlePickerFirstName = (e) => {
    setEditFirstName(e.target.value)
  }
  const handlePickerLastName = (e) => {
    setEditLastName(e.target.value)
  }

  const handlePickerEmail = (e) => {
    setEditEmail(e.target.value);
  }
  const handleCountrypickup = (e) => {

    for (const countryObj of countryName) {
      if (e.target.value === countryObj.id) {
        setSelectedCountry(countryObj.get('name'));
      }
    }
    setCountry(e.target.value)
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

  return (
    <>
    {subTotal !== 0 ?
      <section className="main-container col2-right-layout">

        {(custmerName && custmerName.get('username')) || (custmerGuest === 'Guest') ?
          <div className="main container">
            <div className="row">
              <div className="col-main">
                <div className="row">
                  <div className="col-md-7">
                    <div className="page-title">
                      <h1>Shipping Information</h1>
                    </div>
                    <br />
                    <div className="box-border">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <ul>
                          {pikupDetail && pikupDetail === 'Office Pickup' ?
                            <>
                              <div className="row">
                                <div className="col-sm-6">
                                  <label className="required">Pickup Type</label>
                                  <select className="input form-control" value = {pikupDetail} name="pickuptype" onChange={handleShippingPickUp} ref={register({
                                    required: {
                                      value: true,
                                      message: "You must choose one option from below"
                                    }
                                  })}>
                                    <option> Select Pickup Type</option>
                                    <option value="Local Shipping">Local Shipping</option>
                                    <option value="Office Pickup">Office Pickup</option>
                                  </select>
                                  {errors.pickuptype && (
                                    <div style={{ color: 'red' }} className="error">{errors.pickuptype.message}</div>
                                  )}
                                </div>
                                <div className="col-sm-6">
                                  <label className="required">Country</label>
                                  <select className="input form-control" name="country" value={country && country} onChange={handleCountrypickup} ref={register({
                                    required: {
                                      value: true,
                                      message: "You must choose one option from below"
                                    }
                                  })}>
                                    <option value={selectedCountry && selectedCountry} > {(selectedCountry && selectedCountry) ? selectedCountry : "Select Country"}
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
                              </div>
                              <div className="row">
                                <div className="col-sm-6">
                                  <label for="first_name" className="required">First Name</label>
                                  <input type="text"
                                    className="input form-control"
                                    name="first_name"
                                    value={editFirstName && editFirstName}
                                    onChange={handlePickerFirstName}
                                    id="first_name"
                                    ref={register({
                                      required: {
                                        value: true,
                                        message: "You must enter your first name"
                                      },
                                      minLength: {
                                        value: 3,
                                        message: "Your name must be at least 3 characters"
                                      }
                                    })} />
                                  {errors.first_name && (
                                    <div style={{ color: 'red' }} className="error">{errors.first_name.message}</div>
                                  )}
                                </div>

                                <div className="col-sm-6">
                                  <label for="last_name" className="required">Last Name</label>
                                  <input type="text" name="last_name" value={editLastName && editLastName} className="input form-control" onChange={handlePickerLastName} id="last_name" ref={register({
                                    required: {
                                      value: true,
                                      message: "You must enter your last name"
                                    },
                                    minLength: {
                                      value: 3,
                                      message: "Your name must be at least 3 characters"
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
                                  <input type="text" className="input form-control" value={editEmail && editEmail} name="email_address" onChange={handlePickerEmail} id="email_address" ref={register({
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
                              <br />
                              <br />
                              <div className="cart_navigation"> <Link className="continue-btn" to="/checkout"><i className="fa fa-arrow-left"> </i> Back </Link>

                                <button type="submit" className="button pull-right"><i className="fa fa-angle-double-right"></i> <span>Continue</span></button>
                              </div>
                            </>
                            :
                            <>
                              <div className="row">
                                <div className="col-sm-6">
                                  <label for="first_name" className="required">Pickup Type</label>
                                  <select className="input form-control" name="pickuptype" value={pikupDetail} onChange={handleShippingPickUp} ref={register({
                                    required: {
                                      value: true,
                                      message: "You must choose one option from below"
                                    }
                                  })}>
                                    <option> Select Pickup Type</option>
                                    <option value="Local Shipping">Local Shipping</option>
                                    <option value="Office Pickup">Office Pickup</option>
                                  </select>
                                  {errors.pickuptype && (
                                    <div style={{ color: 'red' }} className="error">{errors.pickuptype.message}</div>
                                  )}
                                </div>
                                <div className="col-xs-6">
                                  <label for="first_name" className="required">Shipping Type</label>
                                  <select onChange={handleShippingType} value={shippingType} className="input form-control" name="shippingtype" ref={register({
                                    required: {
                                      value: true,
                                      message: "You must choose one option from below"
                                    }
                                  })}>
                                    <option> Select Shipping Type</option>
                                    <option value="I am the Recipient">I am the Recipient</option>
                                    <option value="Drop Shipping">Drop Shipping</option>
                                  </select>
                                  {errors.shippingtype && (
                                    <div style={{ color: 'red' }} className="error">{errors.shippingtype.message}</div>
                                  )}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-sm-6">
                                  <label for="first_name" className="required">First Name</label>
                                  <input type="text"
                                    className="input form-control"
                                    name="first_name"
                                    value={editFirstName && editFirstName}
                                    onChange={handleFirstName}
                                    id="first_name"
                                    ref={register({
                                      required: {
                                        value: true,
                                        message: "You must enter your first name"
                                      },
                                      minLength: {
                                        value: 3,
                                        message: "Your name must be at least 3 characters"
                                      }
                                    })} />
                                  {errors.first_name && (
                                    <div style={{ color: 'red' }} className="error">{errors.first_name.message}</div>
                                  )}
                                </div>

                                <div className="col-sm-6">
                                  <label for="last_name" className="required">Last Name</label>
                                  <input type="text" name="last_name" value={editLastName && editLastName} className="input form-control" onChange={handleLastName} id="last_name" ref={register({
                                    required: {
                                      value: true,
                                      message: "You must enter your last name"
                                    },
                                    minLength: {
                                      value: 3,
                                      message: "Your name must be at least 3 characters"
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
                                  <input type="text" className="input form-control" value={editEmail && editEmail} name="email_address" onChange={handleEmail} id="email_address" ref={register({
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
                                  <label for="address" className="required">Street Address</label>
                                  <input type="text" className="input form-control" name="address" value={editAddress && editAddress} onChange={handleAddress} id="address" ref={register({
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
                                    <option value={selectedCountry && selectedCountry} >
                                      {(selectedCountry && selectedCountry) ? selectedCountry : "Select Country"}
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
                                    <option value={selectedRegion && selectedRegion}> {(selectedRegion && selectedRegion) ? selectedRegion : "Select Region"}
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
                                    <option value={selectedProvince && selectedProvince}>{(selectedProvince && selectedProvince) ? selectedProvince : "Select State/Province"}
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
                                    <option value={selectedCity && selectedCity}>{(selectedCity && selectedCity) ? selectedCity : "Select City"}
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
                                    <option value={selectedBarangay && selectedBarangay}>{(selectedBarangay && selectedBarangay) ? selectedBarangay : "Select Barangay"}
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
                                  <input className="input form-control" value={editZip && editZip} type="number" name="postal_code" id="postal_code" onChange={handleZipCode} ref={register({
                                    required: {
                                      value: true,
                                      message: "You must enter your zip code"
                                    },
                                    minLength: {
                                      value: 4
                                    }
                                  })} />
                                  {errors.postal_code && (
                                    <div style={{ color: 'red' }} className="error">{errors.postal_code.message}</div>
                                  )}
                                </div>
                                <div className="col-sm-6">
                                  <label for="contact" className="required">Phone Number</label>
                                  <input className="input form-control" value={editPhone && editPhone} type="number" name="contact" id="contact" onChange={handlePhone} ref={register({
                                    required: {
                                      value: true,
                                      message: "You must enter your Phone Number"
                                    },
                                    minLength: {
                                      value: 11,
                                      message: "Your phone must be number and at leaste 11 Characters"
                                    }
                                  })} />
                                  {errors.contact && (
                                    <div style={{ color: 'red' }} className="error">{errors.contact.message}</div>
                                  )}
                                </div>
                              </div>
                              <br />
                              <br />
                              <div className="cart_navigation">
                                {custmerName && custmerName.get('username') ?
                                  <Link className="continue-btn" to="/viewcart">
                                    <i className="fa fa-arrow-left"> </i> Back to View Cart </Link>
                                  : <Link className="continue-btn" to="/billinginfo">
                                    <i className="fa fa-arrow-left"> </i> Back to Billing Info </Link>}
                                <button type="submit" className="button pull-right"><i className="fa fa-angle-double-right"></i> <span>Continue</span></button>
                              </div>

                            </>}
                        </ul>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-5">
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
                        <div className="col-md-8">
                          <input type="text" placeholder="Gift card or discount code" />
                        </div>
                        <div className="col-md-4">
                          <button type="submit" className=" btn btn-default">Apply</button>
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
            </div>
          </div> : RoutingHistory.push('/')}
      </section>
      : RoutingHistory.push('/')}
    </>
  )
}

export default Shipping;