import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { Link } from 'react-router-dom';
import "react-tabs/style/react-tabs.css";

export const Clients = () => {
    const { token } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const { request } = useHttp();

    const [notPayed, setNotPayed] = useState([]);
    const [payed, setPayed] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [finished, setFinished] = useState([]);

    let fetchItems = useCallback(async () => {
        try {
            let fetched = await request('/api/link/purchases', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            let payedTMP = [];
            let notPayedTMP = [];
            let shipmentsTMP = [];
            let finishedTMP = [];
            fetched.map(el => {
                if (el.finished) {
                    return finishedTMP.unshift(el);
                } else {
                    return el.isPayed ? el.shippingKey ? shipmentsTMP.unshift(el) : payedTMP.unshift(el) : notPayedTMP.unshift(el);
                }
            })
            setNotPayed(notPayedTMP);
            setPayed(payedTMP);
            setShipments(shipmentsTMP);
            setFinished(finishedTMP);
            setItems(fetched);
        } catch (e) { }
    }, [request]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const [select, setSelect] = useState(0);
    return (
        <div className='array-purchase-wrap'>
            <Tabs
                selectedIndex={select}
                onSelect={index => setSelect(index)}
            >
                <TabList>
                    <Tab disabled={!(payed && payed.length)}>{payed.length ? <span className='red'>Payed ( {payed.length} )</span> : 'Payed'}</Tab>
                    <Tab disabled={!(shipments && shipments.length)}>Shipments ( {shipments.length ? <span className='red'>{shipments.length}</span> : 0} )</Tab>
                    <Tab disabled={!(notPayed && notPayed.length)}>Not Payed ( {notPayed.length ? <span className='red'>{notPayed.length}</span> : 0} )</Tab>
                    <Tab disabled={!(finished && finished.length)}>History</Tab>
                </TabList>
                <TabPanel>
                    {(payed.length === 0 &&
                        <h1>Empty</h1>)
                        ||
                        ((payed && payed.length) &&
                            <div>
                                {
                                    <div>
                                        <div className='subscribers-cont'>
                                            {
                                                payed.map((el, i) => {
                                                    let tp = 0;
                                                    el.quantities.map((el_, i_) => tp += el_ * el.prices[i_]);
                                                    let date = new Date(Number(el.date))
                                                    return (
                                                        <div key={`${i}ppch`} className='subscribe-purchase-card payed-purchase-bg min-card'>
                                                            <Link to={`/purchase/${el.shortId}`}>Payed: need Shipping Key</Link>
                                                            <div className='purchase-desc'>
                                                                <p>Email: {el.email}</p>
                                                                <p>Location: {el.location}</p>
                                                                <p>Date: {date.toString().split(' (')[0]}</p>
                                                            </div>
                                                            <div className='purchase-cart-cont'>
                                                                {el.items.map((it, i) => {
                                                                    return (
                                                                        <div key={`${i}ppchci`} className='purchase-cart-item'>
                                                                            <Link key={i} to={`/detailAdmin/${it}`}>
                                                                                <img alt='Avatar' height='200'
                                                                                    src={process.env.PUBLIC_URL + `/upload/${it}/thumb.avatar.jpg`} />
                                                                            </Link>
                                                                            <p>Quantity: {el.quantities[i]}</p>
                                                                            <p>Price: {el.prices[i]}{el.currency}</p>
                                                                            <p>Size: {el.sizes[i]}</p>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <p>Total price: {tp}{el.currency}</p>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                }
                            </div>)
                    }
                </TabPanel>
                <TabPanel>
                    {
                        (shipments && shipments.length) &&
                        <div>
                            {
                                <div>
                                    <div className='subscribers-cont'>
                                        {shipments && shipments.length &&
                                            shipments.map((el, i) => {
                                                let date = new Date(Number(el.date))
                                                let tp = 0;
                                                el.quantities.map((el_, i_) => tp += el_ * el.prices[i_]);
                                                return (
                                                    <div key={`${i}shpch`} className='subscribe-purchase-card min-card shipping-purchase-bg'>
                                                        {!el.isPayed && <h1>Not Payed</h1>}
                                                        <Link to={`/purchase/${el.shortId}`}>Shipping Key - {el.shippingKey}</Link>
                                                        <div className='purchase-desc'>
                                                            <p>Email: {el.email}</p>
                                                            <p>Location: {el.location}</p>
                                                            <p>Date: {date.toString().split(' (')[0]}</p>
                                                        </div>
                                                        <div className='purchase-cart-cont'>
                                                            {el.items.map((it, i) => {
                                                                return (
                                                                    <div key={`${i}sbchci`} className='purchase-cart-item'>
                                                                        <Link key={i} to={`/detailAdmin/${it}`}>
                                                                            <img alt='Avatar' height='200'
                                                                                src={process.env.PUBLIC_URL + `/upload/${it}/thumb.avatar.jpg`} />
                                                                        </Link>
                                                                        <p>Quantity: {el.quantities[i]}</p>
                                                                        <p>Price: {el.prices[i]}{el.currency}</p>
                                                                        <p>Size: {el.sizes[i]}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <p>Total price: {tp}{el.currency}</p>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </TabPanel>
                <TabPanel>
                    {
                        (items && items.length) && (notPayed && notPayed.length) &&
                        <div>
                            {
                                <div>
                                    <div className='subscribers-cont'>
                                        {notPayed && notPayed.length &&
                                            notPayed.map((el, i) => {
                                                let date = new Date(Number(el.date));
                                                let tp = 0;
                                                el.quantities.map((el_, i_) => tp += el_ * el.prices[i_]);
                                                return (
                                                    <div key={`${i}ppchd`} className='subscribe-purchase-card min-card'>
                                                        <Link to={`/purchase/${el.shortId}`}>Not Payed</Link>
                                                        <div className='purchase-desc'>
                                                            <p>Email: {el.email}</p>
                                                            <p>Location: {el.location}</p>
                                                            <p>Date: {date.toString().split(' (')[0]}</p>
                                                        </div>
                                                        <div className='purchase-cart-cont'>
                                                            {el.items.map((it, i) => {
                                                                return (
                                                                    <div key={`${i}ppchci`} className='purchase-cart-item'>
                                                                        <Link key={i} to={`/detailAdmin/${it}`}>
                                                                            <img alt='Avatar' height='200'
                                                                                src={process.env.PUBLIC_URL + `/upload/${it}/thumb.avatar.jpg`} />
                                                                        </Link>
                                                                        <p>Quantity: {el.quantities[i]}</p>
                                                                        <p>Price: {el.prices[i]}{el.currency}</p>
                                                                        <p>Size: {el.sizes[i]}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <p>Total price: {tp}{el.currency}</p>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </TabPanel>
                <TabPanel>
                    {
                        (items && items.length) && (finished && finished.length) &&
                        <div>
                            {
                                <div>
                                    <h1>Finished ( {finished.length} )</h1>
                                    <div className='subscribers-cont '>
                                        {finished && finished.length &&
                                            finished.map((el, i) => {
                                                let date = new Date(Number(el.date));
                                                let tp = 0;
                                                el.quantities.map((el_, i_) => tp += el_ * el.prices[i_]);
                                                return (
                                                    <div key={`${i}fshpch`} className='subscribe-purchase-card min-card finished-card'>
                                                        {!el.isPayed && <h1>Not Payed</h1>}
                                                        <Link to={`/purchase/${el.shortId}`}>Finished</Link>

                                                        <p>Email: {el.email}</p>
                                                        <p>Location: {el.location}</p>
                                                        <p>Date: {date.toString().split(' (')[0]}</p>

                                                        <div className='purchase-cart-cont'>
                                                            {el.items.map((it, i) => {
                                                                return (
                                                                    <div key={`${i}fshpchc`} className='purchase-cart-item'>
                                                                        <Link key={i} to={`/detailAdmin/${it}`}>
                                                                            <img alt='Avatar' height='200'
                                                                                src={process.env.PUBLIC_URL + `/upload/${it}/thumb.avatar.jpg`} />
                                                                        </Link>
                                                                        <p>Quantity: {el.quantities[i]}</p>
                                                                        <p>Price: {el.prices[i]}{el.currency}</p>
                                                                        <p>Size: {el.sizes[i]}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className='purchase-desc'>
                                                            <p>Total price: {tp}{el.currency}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </TabPanel>
            </Tabs>
        </div>
    )
}

