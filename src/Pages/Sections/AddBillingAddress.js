import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Parse } from "parse";
import {LoginContext }from '../../contextapi/LoginContext';
import { Modal } from 'react-bootstrap';

const AddBillingAddress = (props) => {
    // const { id } = useParams()
    useEffect(() => {
        const Country = Parse.Object.extend('Country')
        const checkCountry = new Parse.Query(Country);
        checkCountry.limit(300)
        checkCountry.find().then(
          (result) => {
            setCountryName(result)
            console.log("Result is" , result)
          }
        )
    }, [])
    const { register, handleSubmit, errors } = useForm();
    const { custmerName, addUserName } = useContext(LoginContext);
//    const { custmerName } = useContext(LoginContext);
    const [zip, setZip] = useState();
    const [address, setAddress] = useState();
    const [country, setCountry] = useState();
    const [selectedCountry, setSelectedCountry] = useState();
    const [countryName, setCountryName] = useState();
    const [province, setProvince] = useState();
    const [provinceName, setProvinceName] = useState();
    const [selectedProvince, setSelectedProvince] = useState();
    const [city, setCity] = useState();
    const [cityName, setCityName] = useState();
    const [selectedCity, setSelectedCity] = useState();
    const [region, setRegion] = useState();
    const [regionName, setRegionName] = useState();
    const [selectedRegion, setSelectedRegion] = useState();
    const [barangay, setBarangay] = useState();
    const [barangayName, setBarangayName] = useState();
    const [selectedBarangay, setSelectedBarangay] = useState();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleUpdate = () => {
        
        if (!country) {
            alert("You must choose atleast your country from dropdown options")
          }
        const addAddress = Parse.Object.extend("UserAddress");
        const addingaddress = new addAddress();
        addingaddress.set('address', address )
        addingaddress.set('zipCode' , zip)
        addingaddress.set("country", { "__type": "Pointer", "className": "Country", "objectId": country })
        addingaddress.set("city", { "__type": "Pointer", "className": "City", "objectId": city })
        addingaddress.set("barangay", { "__type": "Pointer", "className": "Barangay", "objectId": barangay })
        addingaddress.set("province", { "__type": "Pointer", "className": "Provinces", "objectId": province})
        addingaddress.set("region", { "__type": "Pointer", "className": "Region", "objectId": region })
        addingaddress.save().then((useraddress)=>{
                     let userAddressAdding = useraddress
                     console.log("userAddress" , useraddress)
                     const User = new Parse.User();
                     const query = new Parse.Query(User);
                     query.get(custmerName.id).then((user) =>{
                     user.set('address', userAddressAdding);
                     user.save().then((res)=>{
                          setShow(true)
                        addUserName(res)
                     }).catch((err)=>{
                         console.log("User not updated", err.message)
                     })
        }).catch((error)=>{
            console.log("user Not Found" , error.message)
        })
        }).catch((error)=>{
            console.log('Error While updating user' , error);
        })
    }

    const handleAddress = (e) => {
        setAddress(e.target.value)
      }
    
      const handleZipCode = (e) => {
        setZip(parseInt(e.target.value))
      }

    const handleCountry = (e) => {
        for (const countryObj of countryName) {
          if (e.target.value === countryObj.id) {
            setSelectedCountry(countryObj.get('name'));
          }
        }
        setCountry(e.target.value)
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
            <div>
                <Modal size='lg' className="view_cart" animation={false} show={show} onHide={handleClose}>
                    <Link to="/dashboard">
                        <Modal.Header closeButton>
                        </Modal.Header>
                    </Link>
                    <Modal.Body>
                        Your Billing Address is Saved successfully.....
            </Modal.Body>
                </Modal>
            </div>
            <section className="main-container col2-right-layout">
                <div className="main container">
                    <div className="row">
                        <div className="col-main col-sm-9 col-xs-12">
                            <div className="page-title">
                                <h2>Billing Information</h2>
                            </div>
                            <br />
                            <div className="box-border">
                                <form className="ps-form--account-setting" method="get">
                                    <div className="ps-form__content">
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <label for="address" className="required"> Street Address</label>
                                                <input type="text" value={address} className="input form-control" name="address" onChange={handleAddress} id="address" ref={register({
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
                                                    required: true
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
                                                        value: "You must choose one option from below"
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
                                                        value: "You must choose one option from below"
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
                                                        value: "You must choose one option from below"
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
                                                        value: "You must choose one option from below"
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
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>Zip Code</label>
                                                    <input
                                                        value={zip}
                                                        type="number"
                                                        className="form-control input"
                                                        name="zip"
                                                        onChange={handleZipCode}
                                                        ref={register({
                                                            required: {
                                                                valueAsNumber: true,
                                                                value: true,
                                                                message: "You must enter your zip code"
                                                            },
                                                            minLength: {
                                                                value: 4,
                                                                message: "Your zip code must be at least 3 characters"
                                                            }
                                                        })} />
                                                    {errors.zip && (
                                                        <div style={{ color: 'red' }} className="error">{errors.zip.message}</div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="cart_navigation">
                                        <button onClick={handleSubmit(handleUpdate)} className="button pull-right"><i className="fa fa-angle-double-right"></i> <span>Add Address</span></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <br />
                        <aside className="right sidebar col-sm-3 col-xs-12">
                            <div className="sidebar-account block">
                                <div className="sidebar-bar-title">
                                    <h3>My Account</h3>
                                </div>
                                <div className="block-content">
                                    <ul>
                                        <li ><Link to="/dashboard">My Dashboard</Link></li>
                                        <li><Link to="/accountinformation">Account Information</Link></li>
                                        <li><Link to="/orderlist">My Orders</Link></li>
                                        <li><Link to="/wishlist">My Wishlist</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    )
}
export default AddBillingAddress;