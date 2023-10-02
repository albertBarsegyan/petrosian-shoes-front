import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hooks';

export const Purchase = () => {
    const { request } = useHttp();
    const { token } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const [shk, setShk] = useState('');
    const [tp, setTp] = useState('');
    const shortId = useParams().id;
    const history = useHistory();
    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/purchase/${shortId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            // console.log(fetched);
            // const paymentDetails = await request(`/api/checkout/GetPaymentDetails/${id}`, 'POST');

            setItem(!fetched.message ? fetched : null);
            let tp_ = 0;
            fetched.quantities.map((el, i) => tp_ += el * fetched.prices[i]);
            setTp(tp_);
        } catch (e) {
            alert(e.message)
        }
    }, [token, shortId, request]);

    useEffect(() => {
        getLink();
    }, [getLink]);

    async function handleDelete() {
        try {
            await request(`/api/link/finishPurchase`, 'POST', { shortId: item.shortId }, {
                Authorization: `Bearer ${token}`
            });
            history.push(`/clients`);
        } catch (e) {
        }
    }
    async function handleShipmentKey() {
        try {
            await request(`/api/link/addShipmentKey`, 'POST', { shortId: item.shortId, shk }, {
                Authorization: `Bearer ${token}`
            });
            window.location.reload(false);
        } catch (e) {
        }
    }

    if (!item) {
        return <div></div>
    }

    return (
        <div>
            {item && <div className='subscribers-cont'>
                <div className={`subscribe-purchase-card ${item.isPayed ? ' payed-purchase-bg' : ''}`}>
                    {item.isPayed && !item.shippingKey ? <h1>Payed: need to serve</h1> : !item.isPayed ? <h1>Not payed</h1> : ''}
                    {item.shippingKey ? <h1>Shipment</h1> : ''}
                    {item.finished ? <h1>Finished</h1> : ''}
                    {!item.shippingKey && !item.finished &&
                        <form onSubmit={() => { handleShipmentKey() }} className="shipping-key-input">
                            <label htmlFor="shipping-key">Shipping-key:</label>
                            <input type="text" id='shipping-key' className='shki' onChange={e => setShk(e.target.value)} ></input>
                            <button type="submit" className="shipping-input-submit">Save</button>
                        </form>
                    }
                    {item.shippingKey &&
                        <p>Shipping Key: {item.shippingKey}</p>
                    }
                    <p>Location: {item.location}</p>
                    <p>Date: {Date(item.date)}</p>
                    <div className='purchase-cart-cont'>
                        {item.items.map((it, i) => {
                            return (
                                <div className='purchase-cart-item'>
                                    <Link key={i} to={`/detailAdmin/${it}`}>
                                        <img alt='Avatar' height='200'
                                            src={process.env.PUBLIC_URL + `/upload/${it}/thumb.avatar.jpg`} />
                                    </Link>
                                    <p>Quantity: {item.quantities[i]}</p>
                                    <p>Price: {item.prices[i]}{item.currency}</p>
                                    <p>Size: {item.sizes[i]}</p>
                                </div>
                            )
                        })}
                    </div>
                    <p>Total price: {tp} {item.currency}</p>
                    <div className='purchase-desc'>

                        <p>First name: {item.fname}</p>
                        <p>Last name: {item.lname}</p>
                        <p>Country: {item.country}</p>
                        {item.region && <p>Region: {item.region}</p>}
                        <p>City: {item.city}</p>
                        <p>Address: {item.address}</p>
                        <p>Postal Code: {item.postalCode}</p>
                    </div>
                    <div className='purchase-footer-wrap'>
                        <button onClick={() => { handleDelete() }} className="deletefromCart delete-purchase"></button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

