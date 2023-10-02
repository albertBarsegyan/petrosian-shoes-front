import React from 'react';
import WelcomeSlides from '../components/Home/welcomeSlides';
import InfiniteSlideLoop from '../components/Home/infiniteSlideLoop';
import IntroAbout from '../components/Home/introAbout';
import CustomMade from '../components/Home/customMade';
import Banner from '../components/Home/banner/banner';
import InfiniteSlideLoopSale from '../components/Home/infiniteSlideLoopSale';
import Popular from '../components/Home/popular';

function Home() {
    return (
        <div className='home'>
            <WelcomeSlides />
            <Banner />
            <InfiniteSlideLoop />
            <CustomMade />
            <InfiniteSlideLoopSale />
            <Popular />
            <IntroAbout />
        </div>
    );
}

export default Home;