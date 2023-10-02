import React from 'react';
import './introAbout.css';
import intro from './img/pintro.jpg'
import logoAva from './img/logoAva.png'

function IntroAbout() {
    return (
        <div className='introAbout'>
            <h1 className='ia-title'>What makes us different</h1>
            <div className='ia-cont'>
                <img className='ia-img' src={intro} alt='' />
                <div className='ia-text-holder'>
                    <img src={logoAva} alt='' />
                    <p className='ia-first-p'><strong>Petrosians Ltd.</strong> produces high quality men's and women's footwear for every season.
                        Our principles are based on teamwork, where everyone's <strong>creativity</strong> plays an important role in creating models,
                        which is the main guarantee of our success.</p>
                    <p className='ia-sec-p'>The craftsmanship of the manufacturers, as well as their love and creativity, invested in the creation of each model,
                        ensure the high quality and comfort of the shoe, and the <strong>unique</strong> and inimitable look of each individual pair. The entire production process is <strong>handmade</strong>.</p>
                </div>
            </div>
        </div>
    );
}

export default IntroAbout;