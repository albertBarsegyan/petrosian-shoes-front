import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { ErrorMessage, Form, Formik } from 'formik'
import { Input } from '../../components/Checkout/Input'
import { shippingSchema } from '../../validation/ShippingValidation'
import { CartContext } from '../../context/CartContext'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'
import { LocationContext } from '../../context/LocationContext'
import { useHttp } from '../../hooks/http.hooks'
import { toast, ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'
import visa from './Visa.svg'
import mastercard from './mastercard.svg'
import './Checkout.css'

const notifySuccess = () => toast('Success! Check your email please.', {
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  autoClose: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  type: 'success'
})

const notifyReject = () => toast('Reject! Your payment was rejected.', {
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  autoClose: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  type: 'error'
})

// 051 - AMD
// 978 - EUR
// 840 - USD
// 643 - RUB

export function Checkout () {
  const { items, setItems } = useContext(CartContext)
  const { state } = useParams()

  const { priceI, setPriceI } = useContext(LocationContext)
  const { cityName, countryName } = useContext(LocationContext)
  const { request } = useHttp()
  const [country, setCountry] = useState()
  const [region, setRegion] = useState()
  let currencySign = '$'
  let currencyCode = '840'
  let Description = ''
  let lang = 'en'
  let totalPrice = 0

  switch (priceI) {
    case 0:
      currencySign = '֏'
      currencyCode = '051'
      break
    case 1:
      currencySign = '$'
      currencyCode = '840'
      break
    case 2:
      currencySign = '€'
      currencyCode = '978'
      break
    case 3:
      currencySign = '₽'
      currencyCode = '643'
      break
    default:
      break
  }

  if (items && state !== 'success') {
    items.map(el => {
      let priceEl = el.prices[priceI]
      if (el.sale) {
        priceEl = el.newPrices[priceI]
      }
      totalPrice += priceEl * el.quantity
      return el
    })
  }

  useEffect(() => {
    let timeoutId
    if (state === 'success') {
      timeoutId = setTimeout(() => {
        setItems(null)
        notifySuccess()
      })
    } else if (state === 'reject') {
      notifyReject()
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [setItems, state])

  const onCountryChange = (val) => {
    setCountry(val)

    switch (val) {
      case 'Armenia':
        currencySign = '֏'
        setPriceI(0)
        currencyCode = '051'
        break
      case 'Russian Federation':
        currencySign = '₽'
        setPriceI(3)
        currencyCode = '643'
        break
      case 'Germany':
      case 'United Kingdom':
      case 'France':
      case 'Italy':
      case 'Spain':
      case 'Ukraine':
      case 'Poland':
      case 'Romania':
      case 'Netherlands':
      case 'Belgium':
      case 'Czech Republic':
      case 'Greece':
      case 'Portugal':
      case 'Sweden':
      case 'Hungary':
      case 'Belarus':
      case 'Denmark':
      case 'Finland':
      case 'Norway':
        setPriceI(2)
        currencySign = '€'
        currencyCode = '978'
        break
      default:
        currencySign = '$'
        setPriceI(1)
        currencyCode = '840'
        break
    }

    items.map(el => {
      let priceEl = el.prices[priceI]
      if (el.sale) {
        priceEl = el.newPrices[priceI]
      }
      totalPrice += priceEl * el.quantity
      return el
    })
    Description = totalPrice + currencySign
  }

  if (!items && state !== 'success') {
    return <Redirect to="/"/>
  }

  return (
    <Formik
      validationSchema={shippingSchema}
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        country,
        region,
        address: '',
        city: '',
        postal: '',
      }}
      onSubmit={async (values) => {
        try {
          const itemsHolder = []
          const prices = []
          const quantities = []
          const sizes = []
          const productNames = []

          items.forEach(el => {
            itemsHolder.push(el.shortId)
            prices.push(el.sale ? el.newPrices[priceI] : el.prices[priceI])
            quantities.push(el.quantity)
            productNames.push(el.name)
            sizes.push(el.size)
          })

          let purchase = {
            email: values.email,
            items: itemsHolder,
            prices,
            currency: currencySign,
            productNames,
            quantities,
            sizes
          }

          let initPayment = await request('/api/checkout/initPayment', 'POST', {
            Currency: currencyCode,
            Description,
            Amount: totalPrice,
            email: values.email
          })

          const PaymentID = initPayment.data.PaymentID
          const OrderID = initPayment.data.OrderID

          await request('/api/link/savePurchase', 'POST', {
            ...values,
            location: `${cityName}, ${countryName}`,
            purchase,
            OrderID,
            PaymentID
          })

          window.location.href = `https://services.ameriabank.am/VPOS/Payments/Pay?id=${PaymentID}&lang=${lang}`
        } catch (e) {
          console.log(e.message)
        }
      }}
    >
      {formik => (
        <div className="checkout">
          <div className="checkout-shipping-cont">
            <Form>
              <h1>Contact information</h1>
              <Input label="Email" name="email" type="email"/>
              <h1>Shipping address</h1>
              <div className="row">
                <Input label="First name" name="firstName" type="text"/>
                <Input label="Last name" name="lastName" type="text"/>
              </div>
              <div className="row">
                <div className={`${country ? 'country-select' : 'aloneInSpace'}`}>
                  <CountryDropdown
                    value={country}
                    className={`${formik.errors.country && 'invalid-input'}`}
                    onChange={async (val) => {
                      await formik.setFieldValue('country', val, true)
                      onCountryChange(val)
                    }}/>
                  {formik.errors.country && <p className="err"><ErrorMessage name="country"/></p>}
                </div>
                {country && <div className="country-select">
                  {<RegionDropdown
                    country={country}
                    className={`${formik.errors.region && 'invalid-input'}`}
                    value={region}
                    onChange={(val) => {
                      setRegion(val)
                      formik.setFieldValue('region', val, true)
                    }}/>
                  }
                  {formik.errors.region && <p className="err"><ErrorMessage name="region"/></p>}
                </div>}
              </div>
              <div className="row">
                <Input label="City" name="city" type="text"/>
                <Input label="Postal code" name="postal" type="number"/>
              </div>
              <Input label="Address" name="address" type="text"/>
              <p className="privacy-intro">*By submitting the order you accept our
                <span className="privacy-terms-cont">
                                    <a target="_blank" href="/privacy">Privacy Policy</a>
                                    <a target="_blank" href="/terms">Terms & Conditions</a>
                                </span>
              </p>
              <input className="checkout-submit" type="submit" disabled={!formik.isValid}/>
            </Form>
          </div>


          {
            state !== 'success' && <div className="checkout-cart">
              {items && items.map(el => <ItemCart key={el.shortId} item={el}/>)}
              <div className="shopping-cart-total">
                <span className="lighter-text">Total: </span>
                <span className="main-color-text"><span className="currency-old">{currencySign}</span>{totalPrice}</span>
              </div>
              <p className="availableWarn-text">If you're waiting to receive an email from us, please also check your spam
                folder.</p>
              <p className="availableWarn-text">*While we endeavor to keep the Site current, we do not guarantee that all
                items featured on the Site at any time remain available for purchase at the time you visit the Site, but
                If we haven't the size of the model of your choice in our store we will manufacture it especially for you
                within 15 days. You will receive a payment confirmation e-mail once and also once about shipment
                details. </p>
              <div className="payment-logo check-pay-log">
                <img alt="mastercard" src={mastercard}/>
                <img alt="visa card" className="visa-logo" src={visa}/>
              </div>
            </div>
          }
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      )}
    </Formik>
  )
}

function ItemCart ({ item }) {
  const { priceI } = useContext(LocationContext)
  let currency = '$'

  switch (priceI) {
    case 0:
      currency = '֏'
      break
    case 1:
      currency = '$'
      break
    case 2:
      currency = '€'
      break
    case 3:
      currency = '₽'
      break
    default:
      break
  }

  let priceEl = item.prices[priceI]
  if (item.sale) {
    priceEl = item.newPrices[priceI]
  }

  return (
    <div>
      <li className="clearfix">
        <img src={process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`} width="70" alt="Item"/>
        <div className="shop-item-detail-cont">
          <div><span>Price: <span className="item-price"><span
            className="currency">{currency}</span>{priceEl}</span></span></div>
          <div><span className="item-size">Size: {item.size}</span></div>
          <div className="quantity">
            <span className="item-quantity">Quantity: {item.quantity}</span>
          </div>
        </div>
      </li>
    </div>
  )
}


