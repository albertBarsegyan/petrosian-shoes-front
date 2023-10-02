import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';

export const Subscribers = () => {
    const { token } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const { request } = useHttp();

    let fetchItems = useCallback(async () => {
        try {
            let fetched = await request('/api/link/email', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setItems(fetched);
        } catch (e) { }
    }, [request]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    async function deleteEmail(email) {
        try {
            let form = { email };
            await request('/api/link/deleteEmail', 'POST', form, {
                Authorization: `Bearer ${token}`
            });
            alert('Deleted');
            window.location.reload(false);
        } catch (e) {
            alert(e.message)
        }
    }

    return (
        <div>
            {
                items && items.length &&
                <div >
                    <p className='header-p'>Total subscribers: {items.length}</p>
                    {
                        <div className='subscribers-cont'>
                            {items.map((el, i) => {
                                let date = new Date(Number(el.date));

                                return (
                                    <div className='subscribe-email-card'>
                                        <p>Email: {el.email}</p>
                                        <p>Location: {el.location}</p>
                                        <p>Messages received: {el.counter}</p>
                                        <p>Date: {date.toString().split(' (')[0]}</p>
                                        <button className="delete-card" onClick={() => deleteEmail(el.email)}>Delete</button>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

