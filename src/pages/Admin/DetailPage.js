import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { ItemDetail } from '../../components/Admin/ItemDetail';

export const DetailPage = () => {
    const { request, loading } = useHttp();
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

    if (loading) {
        return <div></div>
    }

    return (
        <div>
            {!loading && item && <ItemDetail item={item} key={item.shortId} />}
        </div>
    )
}