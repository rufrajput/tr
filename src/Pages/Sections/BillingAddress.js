import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Parse } from "parse";
import { Modal } from 'react-bootstrap';
// import { LoginContext } from "../../contextapi/LoginContext";

const BillingAddress = (props) => {
    const { id } = useParams();
    const { register, handleSubmit, errors } = useForm();
    // const { custmerName, addUserName } = useContext(LoginContext);

    const [editFirstName, setEditFirstName] = useState();
    const [editLastName, setEditLastName] = useState();
    const [editZip, setEditZip] = useState();
    const [editPhone, setEditPhone] = useState();
    const [editAddress, setEditAddress] = useState();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [country, setCountry] = useState();
    const [selectedCountry, setSelectedCountry] = useState();
    const [countryName, setCountryName] = useState();
    const [region, setRegion] = useState();
    const [selectedRegion, setSelectedRegion] = useState();
    const [regionName, setRegionName] = useState();
    const [province, setProvince] = useState();
    const [selectedProvince, setSelectedProvince] = useState();
    const [provinceName, setProvinceName] = useState();
    const [city, setCity] = useState();
    const [selectedCity, setSelectedCity] = useState();
    const [cityName, setCityName] = useState();
    const [barangay, setBarangay] = useState();
    const [selectedBarangay, setSelectedBarangay] = useState();
    const [barangayName, setBarangayName] = useState();


    useEffect(() => {
        let userCountryId;
        let userRegionId;
        let userProvinceId;
        let userCityId;
        const Country = Parse.Object.extend('Country')
        const checkCountry = new Parse.Query(Country);
        checkCountry.limit(300)
        checkCountry.find().then(
            (result) => {
                setCountryName(result)
            }
        )
        const UserAddress = Parse.Object.extend('_User');
        const useraddress = new Parse.Query(UserAddress);
        useraddress.include('address');
        useraddress.get(Parse.User.current().id).then((results) => {
            setEditFirstName(results.get('first_name'));
            setEditLastName(results.get('last_name'))
            setEditPhone(results.get('phone'))
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
                if(res.get('country')){
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
            if(res.get('region')){
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
                })}
                 if(res.get('province')){
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
                }) }
                if(res.get('city')){
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
                }) }
                if(res.get('barangay')){
                let userBarangay = res.get('barangay').id
                const getBarangay = Parse.Object.extend('Barangay');
                const barangaygetting = new Parse.Query(getBarangay);
                barangaygetting.get(userBarangay).then((bar) => {
                    setBarangay(bar.id)
                    setSelectedBarangay(bar.get('barangayName'))
                }, (err) => {
                    console.log('No Barangay Found', err.message)
                }) }
            }) 
        }, (error) => {
            console.error('Error while fetching Order', error);
        });
    }, [])

    const handleUpdate = () => {
        const UpdatingAddress = Parse.Object.extend('_User');
        const addressUpdate = new Parse.Query(UpdatingAddress);
        addressUpdate.include('address');
        addressUpdate.get(Parse.User.current().id).then((update) => {
            update.set('first_name', editFirstName);
            update.set('last_name', editLastName);
            update.set('phone', editPhone);
            update.save().then((save) => {
            }, (err) => {
                console.log("Error Message", err.message)
            })
            let DataUpdating = update.get('address').id
            const GetData = Parse.Object.extend('UserAddress');
            const dataget = new Parse.Query(GetData);
            dataget.include("city");
            dataget.include("country");
            dataget.include('province')
            dataget.get(DataUpdating).then((newResponse) => {
                newResponse.set('address', editAddress);
                newResponse.set('zipCode', editZip);
                newResponse.set('country', { "__type": "Pointer", "className": "Country", "objectId": country })
                newResponse.set('region', { "__type": "Pointer", "className": "Region", "objectId": region })
                newResponse.set('province', { "__type": "Pointer", "className": "Provinces", "objectId": province })
                newResponse.set('city', { "__type": "Pointer", "className": "City", "objectId": city })
                newResponse.set('barangay', { "__type": "Pointer", "className": "Barangay", "objectId": barangay })
                newResponse.save().then((up) => {
                    setShow(true)
                }, (err) => {
                    console.log("Error Message", err.message)
                })           
                // setGettingData(res);
            })
        }, (error) => {
            console.error('Error while fetching Order', error);
        });
    }
    const handleFirstName = (e) => {
        setEditFirstName(e.target.value)
    }
    const handleLastName = (e) => {
        setEditLastName(e.target.value)
    }
    const handleZipCode = (e) => {
        setEditZip(parseInt(e.target.value))
    }
    const handleMobileNumber = (e) => {
        setEditPhone(parseInt(e.target.value))

    }
    const handleAddress = (e) => {
        setEditAddress(e.target.value)
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
            <div>
                <Modal size='lg' className="view_cart" animation={false} show={show} onHide={handleClose}>
                    <Link to="/dashboard">
                        <Modal.Header closeButton>
                        </Modal.Header>
                    </Link>
                    <Modal.Body>
                        Your Billing Address is Updated successfully.....
            </Modal.Body>
                </Modal>
            </div>
            <section className="main-container col2-right-layout">
                <div className="main container">
                    <div className="row">
                        <div className="col-main col-sm-9 col-xs-12">
                            <div className="page-title">
                                <h2>Edit Your Address</h2>
                            </div>
                            <br />
                            <div className="box-border">
                                <form className="ps-form--account-setting" method="get">
                                    <div className="ps-form__content">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                    <label>First Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control input"
                                                        name="first_name"
                                                        onChange={handleFirstName}
                                                        value={editFirstName && editFirstName}
                                                        onClick
                                                        ref={register({
                                                            required: {
                                                                value: true,
                                                                message: "You must enter your first name"
                                                            },
                                                            minLength: {
                                                                value: 3,
                                                                message: "Your name must be at least 3 characters"
                                                            }
                                                        })}
                                                    />
                                                    {errors.first_name && (
                                                        <div style={{ color: 'red' }} className="error">{errors.first_name.message}</div>
                                                    )}
                                            </div>
                                            <div className="col-sm-6">
                                                    <label>Last Name</label>
                                                    <input
                                                        value={editLastName && editLastName}
                                                        type="text"
                                                        className="form-control input"
                                                        name="last_name"
                                                        onChange={handleLastName}
                                                        ref={register({
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
                                            <div className="col-sm-6">
                                                    <label>Zip Code</label>
                                                    <input
                                                        value={editZip && editZip}
                                                        type="text"
                                                        className="form-control input"
                                                        name="zipcode"
                                                        onChange={handleZipCode}
                                                        ref={register({
                                                            required: {
                                                                value: true,
                                                                message: "You must enter your Zip Code"
                                                            },
                                                            minLength: {
                                                                value: 4,
                                                                message: "Your Zip Code must be at least 4 characters"
                                                            }
                                                        })} />
                                                    {errors.zipcode && (
                                                        <div style={{ color: 'red' }} className="error">{errors.zipcode.message}</div>
                                                    )}
                                            </div>
                                            <div className="col-sm-6">
                                               
                                                    <label>Phone Number</label>
                                                    <input
                                                        value={editPhone && editPhone}
                                                        type="text"
                                                        className="form-control input"
                                                        name="number"
                                                        onChange={handleMobileNumber}
                                                        ref={register({
                                                            required: {
                                                                valueAsNumber: true,
                                                                value: true,
                                                                message: "You must enter your mobile number"
                                                            },
                                                            minLength: {
                                                                value: 11,
                                                                message: "Your mobile number must be numbers and at least 11 characters"
                                                            },
                                                            maxLength:{
                                                               value:11,
                                                               message: "Maximum number character limit is 11"
                                                               }
                                                        })} />
                                                    {errors.number && (
                                                        <div style={{ color: 'red' }} className="error">{errors.number.message}</div>
                                                    )}
                                            </div>
                                            </div>
                                            <div className="row">
                                            <div className="col-sm-12">
                                                <label>Address</label>
                                                <input type="text"
                                                    className="form-control input"
                                                    value={editAddress && editAddress}
                                                    onChange={handleAddress}
                                                    name="address"
                                                    ref={register({
                                                        required: {
                                                            value: true,
                                                            message: "You must enter your eamil"
                                                        },

                                                    })} />
                                                {errors.address && (
                                                    <div style={{ color: 'red' }} className="error">{errors.address.message}</div>
                                                )}
                                            </div>
                                            </div>
                                            <div className="row">
                                            <div className="col-sm-6">
                                                    <label className="required">Country</label>
                                                    <select className="input form-control" name="country" value={country && country} onChange={handleCountry} ref={register({
                                                        required: {
                                                            value: true,
                                                            message: "You must choose one option from below"
                                                        }
                                                    })}>
                                                        <option value={selectedCountry && selectedCountry} >   
                                                        {(selectedCountry && selectedCountry) ? selectedCountry : "Select Country" }
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
                                                    <select className="input form-control" name="region" value={region && region} onChange={handleRegion} ref={register({
                                                        required: {
                                                            value: true,
                                                            message: "You must choose one option from below"
                                                        }
                                                    })}>
                                                        <option value={selectedRegion && selectedRegion}> 
                                                        
                                                        {(selectedRegion && selectedRegion) ? selectedRegion : "Select Region" }
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
                                                <select className="input form-control" name="province" value={province && province} onChange={handleProvince} ref={register({
                                                    required: {
                                                        value: true,
                                                        message: "You must choose one option from below"
                                                    }
                                                })}>
                                                    <option value={selectedProvince && selectedProvince}>{(selectedProvince && selectedProvince) ? selectedProvince : "Select State/Province" }
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
                                                    <select className="input form-control" value={city && city} onChange={handleCity} name="city" ref={register({
                                                        required: {
                                                            value: true,
                                                            message: "You must choose one option from below"
                                                        }
                                                    })}>
                                                        <option value={selectedCity && selectedCity}>{(selectedCity && selectedCity) ? selectedCity : "Select City" }
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
                                                    <select className="input form-control" name="barangay" value={barangay && barangay} onChange={handleBrangay} ref={register({
                                                        required: {
                                                            value: true,
                                                            message: "You must choose one option from below"
                                                        }
                                                    })}>
                                                        <option value={selectedBarangay && selectedBarangay}> {(selectedBarangay && selectedBarangay) ? selectedBarangay : "Select Barangay" }
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
                                        <div className="form-group">
                                            <label>Address</label>
                                            <input type="text"
                                                className="form-control input"
                                                value={editAddress && editAddress}
                                                onChange={handleAddress}
                                                name="address"
                                                ref={register({
                                                    required: {
                                                        value: true,
                                                        message: "You must enter your address"
                                                    },

                                                })} />
                                            {errors.address && (
                                                <div style={{ color: 'red' }} className="error">{errors.address.message}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="cart_navigation">
                                        <button onClick={handleSubmit(handleUpdate)} className="button pull-right"><i className="fa fa-angle-double-right"></i> <span>Update</span></button>
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
                                        <li className="current"><Link>Billing Address</Link></li>
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
export default BillingAddress;