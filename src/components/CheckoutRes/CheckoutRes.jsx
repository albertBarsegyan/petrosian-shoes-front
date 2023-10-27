import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hooks'
import { Loader } from '../Loader/Loader'
import { FailIcon } from '../icons/Fail.icon'
import { SuccessIcon } from '../icons/Success.icon'

export default function CheckoutRes () {
  const { id: orderId } = useParams()
  const { request, loading } = useHttp()
  const [data, setData] = useState({})
  const [stopWatchSeconds, setStopWatchSeconds] = useState(10)

  useEffect(() => {
    request(`/api/checkout/GetPaymentDetails/${orderId}`, 'POST').then((response) => {
      setData(response)
    })
  }, [orderId, request])

  useEffect(() => {
    let intervalId = setInterval(() => {
      setStopWatchSeconds(prev => prev - 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  if (!stopWatchSeconds) {
    return <Redirect to="/"/>
  }

  if (loading)
    return <Loader/>

  if (data.ResponseCode === '00') {
    return (
      <div className="mgt-50">
        <SuccessIcon/>
        <p>Dear {data.ClientName}</p>

        <p>Your payment was <span style={{ fontWeight: 900 }}>approved</span></p>
        <p>For details check your email</p>

        <p>You will be redirected to the homepage in {stopWatchSeconds} seconds. Thank you for your patience.</p>
      </div>
    )
  }

  return (
    <div className="mgt-50">
      <FailIcon/>
      <p>Dear {data.ClientName}</p>
      <p>Your payment wasn{'\''}t confirmed</p>
      <p>Please try again</p>
      <p>You will be redirected to the homepage in {stopWatchSeconds} seconds. Thank you for your patience.</p>
    </div>
  )
}


