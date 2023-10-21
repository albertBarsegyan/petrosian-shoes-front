import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hooks';
import {Loader} from "../Loader/Loader";
import {FailIcon} from "../icons/Fail.icon";
import {SuccessIcon} from "../icons/Success.icon";

export default function CheckoutRes() {
  const {id} = useParams();
  const {request, loading} = useHttp();
  const [data, setData] = useState({});


  useEffect(() => {
    request(`/api/checkout/GetPaymentDetails/${id}`, 'POST').then((response) => {
      setData(response)
    });
  }, [id, request]);


  if (loading)
    return <Loader/>


  if (data.ResponseCode === '00') {
    return (
      <div className='mgt-50'>
        <SuccessIcon/>
        <p>Dear {data.ClientName}</p>

        <p>Your payment was <span style={{fontWeight: 900}}>approved</span></p>
        <p>For details check your email</p>
      </div>
    )
  }

  return (
    <div className='mgt-50'>
      <FailIcon/>
      <p>Dear {data.ClientName}</p>
      <p>Your payment wasn{"'"}t confirmed</p>
      <p>Please try again</p>
    </div>
  )
}


