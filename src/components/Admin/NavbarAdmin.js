import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import logo from './logo.png';
import './NavbarAdmin.css'

export const NavbarAdmin = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <nav className='navbar-admin'>
      <NavLink to='/'><img className='logo' src={logo} alt='Petrosian' /></NavLink>
      <div className="left-panel">
        <NavLink to="/clients">Purchases</NavLink>
        <NavLink to='/man'>Man</NavLink>
        <NavLink to='/woman'>Woman</NavLink>
      </div>
      <div className='right-panel'>
        <NavLink to="/create">Create</NavLink>
        <NavLink to="/links">Collection</NavLink>
        <NavLink to="/sale">Sale</NavLink>
        <NavLink to="/setslideshow">SlideShow</NavLink>
        <NavLink to="/subscribers">Subscribers</NavLink>
        <NavLink to="/" onClick={logoutHandler}>Logout</NavLink>
      </div>
    </nav>
  )
}
