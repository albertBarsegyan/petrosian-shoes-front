import React from 'react';
import { Link } from 'react-router-dom';
import fb from './fb.png'
import insta from './insta.png'
import mastercard from './mastercard.svg'
import visa from './Visa.svg'
import './Footer.css'

export const Footer = () => {
    return (
        <footer>
            <div className='footer'>
                <div className='footer-menu'>
                    <div className='first-col'>
                        <Link onClick={() => { window.scrollTo(0, 0) }} to='/'>Home</Link>
                        <Link to='/man'>Man</Link>
                        <Link to='/woman'>Woman</Link>
                        <Link to='/contact'>Contact us</Link>
                    </div>
                    <div className='sec-col'>
                        <Link target="_blank" to='/terms'>Terms & Conditions</Link>
                        <Link target="_blank" to='/privacy'>Privacy Policy</Link>
                    </div>
                </div>
                <div className='social'>
                    <h1>We're on social media</h1>
                    <div className='social-cont'>
                        <Link to='/'><img alt='facebook' src={fb} /></Link>
                        <Link to='/'><img alt='instagram' src={insta} /></Link>
                    </div>
                </div>
            </div>
            <div className='copyright'>
                <div className='payment-logo'>
                    <img alt='' src={mastercard} />
                    <img alt='' src={visa} />
                </div>
            </div>
            <div className='copyright'>
                <div className='privacy-terms-cont'>
                    <a target="_blank" href='/privacy'>Privacy Policy</a>
                    <a target="_blank" href='/terms'>Terms & Conditions</a>
                </div>
                <p>Copyright ©2021 Petrosian Brand. All rights reserved.</p>
            </div>
        </footer>
    );
}