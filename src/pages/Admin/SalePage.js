import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { useHistory } from 'react-router';
import './CreatePage.css'

export const SalePage = () => {
    const history = useHistory();
    const { token } = useContext(AuthContext);
    const { request } = useHttp();

    const [amd, setAmd] = useState('');
    const [usd, setUsd] = useState('');
    const [eur, setEur] = useState('');
    const [rub, setRub] = useState('');
    const [shortId, setShortId] = useState('');




    const submitHandler = async event => {
        if (!((amd || usd || eur || rub) && shortId)) {
            return alert('Please fill all fields');
        }

        try {
            let form = {
                shortId,
                newPrices: [amd, usd, eur, rub]
            }

            await request('/api/link/doSale', 'POST', form, {
                Authorization: `Bearer ${token}`
            });
            alert('Success')
            history.push('/links');
        } catch (e) {
            if (e.message !== 'Failed to fetch') alert(e.message)
            else history.push('/links')
        }
    };

    const undoSubmitHandler = async event => {
        if (!shortId) {
            return alert('Please fill id');
        }

        try {
            let form = {
                shortId
            }

            await request('/api/link/undoSale', 'POST', form, {
                Authorization: `Bearer ${token}`
            });
            alert('Success');
            history.push(`/detailAdmin/${shortId}`);
        } catch (e) {
            if (e.message !== 'Failed to fetch') alert(e.message)
            else history.push('/links')
        }
    };

    const removeHandler = async event => {
        try {
            await request('/api/link/offSale', 'POST', {}, {
                Authorization: `Bearer ${token}`
            });
        } catch (e) {
            if (e.message !== 'Failed to fetch') alert(e.message)
        }
    };

    return (
        <div>
            <form className='add-item-cont'>
                <button className='button switch-off' onClick={() => { removeHandler(); alert('All sales removed'); }}>Switch off</button>
                <div className="input-field">
                    <label htmlFor="name">ShortId</label>
                    <input
                        placeholder="Short Id.."
                        id="shortId"
                        type="text"
                        value={shortId}
                        onChange={e => setShortId(e.target.value)}
                    />
                </div>
                <div className='price-inputs'>
                    <div className='column'>
                        <div className="input-field">
                            <label htmlFor="priceAMD">AMD</label>
                            <input
                                placeholder="AMD"
                                id="priceAMD"
                                type="number"
                                value={amd}
                                onChange={e => setAmd(e.target.value)}
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="priceUSD">USD</label>
                            <input
                                placeholder="USD"
                                id="priceUSD"
                                type="number"
                                value={usd}
                                onChange={e => setUsd(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='column'>
                        <div className="input-field">
                            <label htmlFor="priceEUR">EUR</label>
                            <input
                                placeholder="EUR"
                                id="priceEUR"
                                type="number"
                                value={eur}
                                onChange={e => setEur(e.target.value)}
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="priceRUB">RUB</label>
                            <input
                                placeholder="RUB"
                                id="priceRUB"
                                type="number"
                                value={rub}
                                onChange={e => setRub(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="sale-btn-cont">
                    <button onClick={() => submitHandler()}>Do Sale</button>
                    <button onClick={() => undoSubmitHandler()}>Undo Sale</button>
                </div>
            </form>
        </div>
    )
}

