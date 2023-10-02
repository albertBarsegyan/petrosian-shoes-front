import React from 'react';
import './banner.css';

function Banner() {
    return (
        <div className='banner'>
            <div className='col'>
                <h1>FREE SHIPPING</h1>
                <p>All our shipments are free.</p>
            </div>
            <div className='col col-mid'>
                <h1>EASY RETURNS</h1>
                <p>Contact us to create your return.</p>
            </div>
            <div className='col'>
                <h1>SECURE PAYMENTS</h1>
                <p>Mastercard, Visa, Paypal payments.</p>
            </div>
        </div>
    );
}

export default Banner;