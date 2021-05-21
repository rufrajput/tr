import paymaya from 'paymaya-js-sdk';
import { isEmptyObject } from '../EmptyObject';

export const initPaymaya = () => {
    paymaya.init('pk-yaj6GVzYkce52R193RIWpuRR5tTZKqzBWsUeCkP9EAf', true);
}

const setBuyerInfo = (user, billing, shipping) => {
    console.log('setBuyerInfo billing: ', billing);
    console.log('setBuyerInfo shipping: ', shipping);
    console.log('setBuyerInfo user: ', user);

    let buyerInfo
    if (user && !isEmptyObject(user)) {
        buyerInfo = {
            "firstName": user.get('first_name'),
            "lastName": user.get('last_name'),
            "contact": {
                "phone": user.get('phone').toString(),
                "email": user.get('email'),
            },
        }
    }
    else if (shipping && !isEmptyObject(shipping)) {
        buyerInfo = {
            "firstName": shipping.get('firstName'),
            "lastName": shipping.get('lastName'),
            "contact": {
                "phone": shipping.get('phone').toString(),
                "email": shipping.get('email'),
            },
        }
    }
    else {
        buyerInfo = {
            "firstName": billing.get('firstName'),
            "lastName": billing.get('lastName'),
            "contact": {
                "phone": billing.get('phone').toString(),
                "email": billing.get('email'),
            },
        }
    }
    return buyerInfo;
}
const setBillingInfo = (billing, shipping) => {
    console.log('setBillingInfo billing: ', billing);
    console.log('setBillingInfo shipping: ', shipping);
    let billingInfo;
    if (billing && !isEmptyObject(billing)) {
        billingInfo = {
            "line1": billing.get('address'),
            "line2": billing.get('address'),
            "city": billing.get('city'),
            "state": billing.get('province'),
            "zipCode": billing.get('zip').toString(),
            "countryCode": "PH",
        }
    }
    else {
        billingInfo = {
            "line1": shipping.get('address'),
            "line2": shipping.get('address'),
            "city": shipping.get('city'),
            "state": shipping.get('province'),
            "zipCode": shipping.get('zip').toString(),
            "countryCode": "PH",
        }
    }
    return billingInfo;
}
const setShippingInfo = (shipping, billing) => {
    console.log('setShippingInfo billing: ', billing);
    console.log('setShippingInfo shipping: ', shipping);
    let shippingInfo;
    if (shipping && !isEmptyObject(shipping)) {
        shippingInfo = {
            "firstName": shipping.get('firstName'),
            "lastName": shipping.get('lastName'),
            "phone": shipping.get('phone').toString(),
            "email": shipping.get('email'),
            "line1": shipping.get('address'),
            "line2": shipping.get('address'),
            "city": shipping.get('city'),
            "state": shipping.get('province'),
            "zipCode": shipping.get('zip').toString(),
            "countryCode": "PH",
            "shippingType": "ST"
        }
    }
    else {
        shippingInfo = {
            "firstName": billing.get('firstName'),
            "lastName": billing.get('lastName'),
            "phone": billing.get('phone').toString(),
            "email": billing.get('email'),
            "line1": billing.get('address'),
            "line2": billing.get('address'),
            "city": billing.get('city'),
            "state": billing.get('province'),
            "zipCode": billing.get('zip').toString(),
            "countryCode": "PH",
            "shippingType": "ST"
        }
    }
    return shippingInfo;
}
export const handlePayment = async (orderId, userInfo, billing_data, shipping_data, items, subTotal) => {
    console.log('handlePayment running');
    let orderItems = [];
    for (let i = 0; i < items.length; i++) {
        orderItems[i] = {
            "name": items[i].name,
            "quantity": items[i].qty.toString(),
            "code": items[i].id,
            "description": items[i].name,
            "amount": {
                "value": items[i].price.toString(),
                "details": {
                    "discount": "0",
                    "serviceCharge": "0",
                    "shippingFee": "0",
                    "tax": "0",
                    "subtotal": items[i].price.toString()
                }
            },
            "totalAmount": {
                "value": items[i].price.toString(),
                "details": {
                    "discount": "0",
                    "serviceCharge": "0",
                    "shippingFee": "0",
                    "tax": "0",
                    "subtotal": items[i].price.toString()
                }
            }
        }
    }
    const buyerDetails = setBuyerInfo(userInfo, billing_data, shipping_data);
    const billingDetails = setBillingInfo(billing_data, shipping_data);
    const shippingDetails = setShippingInfo(billing_data, shipping_data);

    let CheckoutObject = {
        "totalAmount": {
            "value": subTotal.toString(),
            "currency": "PHP",
            "details": {
                "discount": "0",
                "serviceCharge": "0",
                "shippingFee": "0",
                "tax": "0",
                "subtotal": subTotal.toString()
            }
        },
        "buyer": {
            "firstName": buyerDetails.firstName,
            "lastName": buyerDetails.lastName,
            "contact": {
                "phone": buyerDetails.contact.phone,
                "email": buyerDetails.contact.email,
            },
            "shippingAddress": {
                "firstName": shippingDetails.firstName,
                "lastName": shippingDetails.lastName,
                "phone": shippingDetails.phone,
                "email": shippingDetails.email,
                "line1": shippingDetails.line1,
                "line2": shippingDetails.line2,
                "city": shippingDetails.city,
                "state": shippingDetails.state,
                "zipCode": shippingDetails.zipCode,
                "countryCode": "PH",
                "shippingType": "ST",
            },
            "billingAddress": {
                "line1": billingDetails.line1,
                "line2": billingDetails.line2,
                "city": billingDetails.city,
                "state": billingDetails.state,
                "zipCode": billingDetails.zipCode,
                "countryCode": "PH",
            },
        },
        "items": orderItems,
        "redirectUrl": {
            "success": window.location.origin + "/payment/success/" + orderId,
            "failure": window.location.origin + "/payment/failure/" + orderId,
            "cancel": window.location.origin + "/payment/failure/" + orderId
        },
        "requestReferenceNumber": orderId.toString(),
        "metadata": {}
    }
    localStorage.setItem('checkoutObject', JSON.stringify(CheckoutObject));
    try {
        await paymaya.createCheckout(CheckoutObject);
    }
    catch (err) {
        alert('payment failed',);
    }


}