import React, { useCallback, useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { LinksPage } from './pages/Admin/LinksPage'
import { CreatePage } from './pages/Admin/CreatePage'
import { DetailPage } from './pages/Admin/DetailPage'
import { EditPage } from './pages/Admin/EditPage'
import { SalePage } from './pages/Admin/SalePage'
import { SetSlides } from './pages/Admin/SetSlides'
import { Subscribers } from './pages/Admin/Subscribers'
import { Clients } from './pages/Admin/Clients'
import { AuthPage } from './pages/Admin/AuthPage'
import { useCart } from './hooks/cart.hook'
import { DetailPublic } from './pages/Detail/DetailPublic'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/HomePage'
import Man from './pages/Man/Man'
import SaleMan from './pages/Sale.Man/Sale'
import SaleWoman from './pages/Sale.Woman/Sale'
import ManSummer from './pages/Man.Summer/Man'
import ManWinter from './pages/Man.Winter/Man'
import Woman from './pages/Woman/Woman'
import WomanSummer from './pages/Woman.Summer/Woman'
import WomanWinter from './pages/Woman.Winter/Woman'
import Accessories from './pages/Accessories/Accessories'
import ByRequest from './pages/ByRequest/ByRequest'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import { CartContext, LengthContext, PriceContext } from './context/CartContext'
import { LocationContext } from './context/LocationContext'
import { Checkout } from './pages/Checkout/Checkout'
import { useHttp } from './hooks/http.hooks'
import Terms from './pages/Terms/Terms'
import { NavbarAdmin } from './components/Admin/NavbarAdmin'
import Privacy from './pages/Privacy/Privacy'
import { Purchase } from './pages/Admin/PurchasePage'
import CheckoutRes from './components/CheckoutRes/CheckoutRes'

export const useRoutes = isAuthenticated => {
  const { set, get } = useCart()
  const { request } = useHttp()
  const [cityName, setCityName] = useState(null)
  const [countryName, setCountryName] = useState(null)
  const [timezone, setTimezone] = useState(null)
  const [items, setItems] = useState(get)
  const [totalPrice, setTotalPrice] = useState(null)
  const [priceI, setPriceI] = useState(0)
  const [length, setLength] = useState(0)

  const fetchLocation = useCallback(async () => {
    try {
      let data = await request('https://ipapi.co/json/', 'GET', null)

      setCityName(data.city)
      setCountryName(data.country_name)
      setTimezone(data.timezone)

      navigator.geolocation.getCurrentPosition(
        async function (position) {
          let data = await request(
            `/api/link/getLocation/${position.coords.latitude}/${position.coords.longitude}`,
            'GET',
          )

          if (data?.continent) {
            setCityName(data?.region)
            setCountryName(data?.country)
            setPriceI(1)
            setTimeout(() => {
              if (data?.country === 'Russia') {
                setPriceI(3)
              } else if (data?.country === 'Armenia') {
                setPriceI(0)
              } else if (data?.continent === 'Europe') {
                setPriceI(2)
              } else {
                setPriceI(1)
              }
            })
          }
        },
        async function (error) {
          setPriceI(1)
          // console.error("Error Code = " + error.code + " - " + error.message);
        }
      )
    } catch (e) {
      setPriceI(1)
      // console.log(e);
    }
  }, [request])

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  // this useEffect depends on items length on every pages rendering
  // arr of items
  let arr = [items]
  if (items) {
    arr.push(items.length)
  }
  useEffect(() => {
    if (items && items.length) {
      set(items)
      let temp = 0
      items.map(el => temp += el.prices[0] * el.quantity)
      setTotalPrice(temp)
    } else {
      set(null)
    }
  }, arr)

  if (isAuthenticated) {
    return (
      <React.Fragment>
        <NavbarAdmin/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/links" exact component={LinksPage}/>
          <Route path="/create" exact component={CreatePage}/>
          <Route path="/edit/:id" component={EditPage}/>
          <Route path="/detail/:id" component={DetailPublic}/>
          <Route path="/detailAdmin/:id" component={DetailPage}/>
          <Route path="/purchase/:id" component={Purchase}/>
          <Route path="/sale" component={SalePage}/>
          <Route path="/setslideshow" component={SetSlides}/>
          <Route path="/subscribers" component={Subscribers}/>
          <Route path="/clients" component={Clients}/>
          <Route path="/man" exact component={Man}/>
          <Route path="/woman" exact component={Woman}/>
          <Redirect to="/create"/>
        </Switch>
      </React.Fragment>
    )
  }

  return (
    <LocationContext.Provider value={{ cityName, countryName, timezone, priceI, setPriceI }}>
      <PriceContext.Provider value={{ totalPrice, setTotalPrice }}>
        <CartContext.Provider value={{ items, setItems }}>
          <LengthContext.Provider value={{ length, setLength }}>
            <Navbar/>
            <Switch>
              <Route path="/login" exact component={AuthPage}/>
              <Route path="/" exact component={Home}/>
              <Route path="/man" exact component={Man}/>
              <Route path="/man/spring-summer" exact component={ManSummer}/>
              <Route path="/man/autumn-winter" exact component={ManWinter}/>
              <Route path="/woman/spring-summer" exact component={WomanSummer}/>
              <Route path="/woman/autumn-winter" exact component={WomanWinter}/>
              <Route path="/woman" exact component={Woman}/>
              <Route path="/detail/:id" component={DetailPublic}/>
              <Route path="/accessories" exact component={Accessories}/>
              <Route path="/order" exact component={ByRequest}/>
              <Route path="/about" exact component={About}/>
              <Route path="/contact" exact component={Contact}/>
              <Route path="/checkout/:state" exact component={Checkout}/>
              <Route path="/sale/man" exact component={SaleMan}/>
              <Route path="/sale/woman" exact component={SaleWoman}/>
              <Route path="/checkoutRes/:id" exact component={CheckoutRes}/>
              <Route path="/terms" exact component={Terms}/>
              <Route path="/privacy" exact component={Privacy}/>
              <Redirect to="/"/>
            </Switch>
          </LengthContext.Provider>
        </CartContext.Provider>
      </PriceContext.Provider>
    </LocationContext.Provider>
  )
}
