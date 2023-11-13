import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hooks'
import styles from './PurchasePage.module.css'

export const Purchase = () => {
  const { request } = useHttp()
  const { token } = useContext(AuthContext)
  const [item, setItem] = useState(null)
  const [shippingKey, setShippingKey] = useState('')
  const [courierServiceName, setCourierServiceName] = useState('')
  const [courierServiceLink, setCourierServiceLink] = useState('')
  const [tp, setTp] = useState('')
  const shortId = useParams().id
  const history = useHistory()
  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/link/purchase/${shortId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })

      setItem(!fetched.message ? fetched : null)
      let tp_ = 0
      fetched.quantities.map((el, i) => tp_ += el * fetched.prices[i])
      setTp(tp_)
    } catch (e) {
      alert(e.message)
    }
  }, [token, shortId, request])

  useEffect(() => {
    getLink()
  }, [getLink])

  async function handleDelete () {
    try {
      await request(`/api/link/finishPurchase`, 'POST', { shortId: item.shortId }, {
        Authorization: `Bearer ${token}`
      })
      history.push(`/clients`)
    } catch (e) {
    }
  }

  async function handleShipmentKey (e) {
    e.preventDefault()

    try {
      await request(`/api/link/addShipmentKey`, 'POST', {
        shippingKey,
        courierServiceName,
        courierServiceLink,
        shortId: item.shortId,
      }, {
        Authorization: `Bearer ${token}`
      })

      window.location.reload(false)
    } catch (e) {

      console.log('went wrong', e.message)
    }
  }

  if (!item) {
    return <div></div>
  }

  return (
    <div>
      {item && <div className="subscribers-cont">
        <div className={`subscribe-purchase-card ${item.isPayed ? ' payed-purchase-bg' : ''}`}>
          {item.isPayed && !item.shippingKey ? <h1>Payed, need to serve</h1> : !item.isPayed ? <h1>Not payed</h1> : ''}
          {item.shippingKey ? <h1>Shipment</h1> : ''}
          {item.finished ? <h1>Finished</h1> : ''}
          {!item.shippingKey && !item.finished &&
            <form onSubmit={handleShipmentKey} className="shipping-key-input">
              <div className={styles.inputsWrapper}>
                <div>

                  <input placeholder="Shipping key" type="text" id="shipping-key" className="shki"
                         onChange={e => setShippingKey(e.target.value)}></input>
                </div>

                <div>
                  <input type="text" className="shki" placeholder="Courier service name"
                         onChange={e => setCourierServiceName(e.target.value)}></input>
                </div>

                <div>

                  <input placeholder="Courier service link" type="text" className="shki"
                         onChange={e => setCourierServiceLink(e.target.value)}></input>
                </div>
              </div>

              <button type="submit" className="shipping-input-submit">Save</button>
            </form>
          }
          {item.shippingKey &&
            <p>Shipping Key: {item.shippingKey}</p>
          }
          <p>Location: {item.location}</p>
          <p>Date: {Date(item.date)}</p>
          <div className="purchase-cart-cont">
            {item.items.map((it, i) => {
              return (
                <div className="purchase-cart-item">
                  <Link key={i} to={`/detailAdmin/${it}`}>
                    <img style={{ width: '100%' }} alt="Avatar"
                         src={process.env.PUBLIC_URL + `/upload/${it}/thumb.avatar.jpg`}/>
                  </Link>
                  <div style={{ marginLeft: '8px' }}>
                    <p>Quantity: {item.quantities[i]}</p>
                    <p>Price: {item.prices[i]}{item.currency}</p>
                    <p>Size: {item.sizes[i]}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.separator}></div>
          <div className="purchase-desc">

            <p>First name: {item.fname}</p>
            <p>Last name: {item.lname}</p>
            <p>Country: {item.country}</p>
            {item.region && <p>Region: {item.region}</p>}
            <p>City: {item.city}</p>
            <p>Address: {item.address}</p>
            <p>Postal Code: {item.postalCode}</p>
          </div>
          <div className="purchase-footer-wrap">
            <button onClick={() => {
              handleDelete()
            }} className="deletefromCart delete-purchase"></button>
          </div>

          <p>Total price: {tp} {item.currency}</p>
        </div>
      </div>}
    </div>
  )
}

