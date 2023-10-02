import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hooks';
import { useHistory } from "react-router-dom";

export default function CheckoutRes() {
    const { id } = useParams();
    const { request, loading } = useHttp();
    const [data, setData] = useState({})
    let history = useHistory();

    useEffect(async () => {
        try {
            const temp = await request(`/api/checkout/GetPaymentDetails/${id}`, 'POST');
            setData(temp);
            if (temp.ResponseCode === '00') {
                history.push(`/receipt/${temp.OrderID}`);
            } else {
                history.push('/checkout/reject');
            }
        } catch (e) {
            history.push('/checkout/reject');
        }
    }, []);

    if (loading) {
        return (
            <div></div>
        )
    }

    if (data.ResponseCode === '00') {
        return (
            <div className='mgt-50'>
                <p>Success! Check your email for details</p>
                <p>Amount: {data.Amount}</p>
                <p>Approved Amount: {data.ApprovedAmount}</p>
                <p>Currency: {data.Currency}</p>
            </div>
        )
    }

    return (
        <div className='mgt-50'>
            <p>Reject!</p>
            <p>Amount: {data.Amount}</p>
            <p>Approved Amount: {data.ApprovedAmount}</p>
            <p>Currency: {data.Currency}</p>
        </div>
    )
}
