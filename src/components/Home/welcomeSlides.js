import React from 'react';
import './welcomeSlides.css';

function WelcomeSlides() {
    return (
        <div className='welcomeSlides'>
            <div className="wrapper">
                <div className="slideshows">
                    <div className="slideshow slideshow--hero">
                        <div className="slides">
                            <div className="slide slide1" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide1.webp` }}></div>
                            <div className="slide slide2" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide2.webp` }}></div>
                            <div className="slide slide3" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide3.webp` }}></div>
                        </div>
                    </div>
                    <div className="slideshow slideshow--contrast slideshow--contrast--before">
                        <div className="slides">
                            <div className="slide slide1" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide1.webp` }}></div>
                            <div className="slide slide2" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide2.webp` }}></div>
                            <div className="slide slide3" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide3.webp` }}></div>
                        </div>
                    </div>
                    <div className="slideshow slideshow--contrast slideshow--contrast--after">
                        <div className="slides">
                            <div className="slide slide1" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide1.webp` }}></div>
                            <div className="slide slide2" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide2.webp` }}></div>
                            <div className="slide slide3" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/upload/slide3.webp` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeSlides;