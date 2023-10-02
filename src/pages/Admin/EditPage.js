import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { ItemEdit } from '../../components/Admin/ItemEdit';

export const EditPage = () => {
    const { request } = useHttp();
    const { token } = useContext(AuthContext);
    const [item, setItem] = useState(null);
    const shortId = useParams().id;

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${shortId}`, 'GET', null);
            setItem(fetched);
        } catch (e) {
            alert(e.message)
        }
    }, [token, shortId, request]);

    useEffect(() => {
        getLink();
    }, [getLink]);

    return (
        <div>
            {item && <ItemEdit item={item} key={item.shortId} />}
        </div>
    )
}