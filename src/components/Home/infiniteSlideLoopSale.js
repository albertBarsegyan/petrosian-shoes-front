import React, { useCallback, useContext, useEffect, useState } from 'react';
import './infiniteSlideLoopSale.css';
import { useHttp } from '../../hooks/http.hooks';
import { LocationContext } from '../../context/LocationContext';
import Slider from 'react-slick';
import useWindowDimensions from '../windowDimensions';

export default function InfiniteSlideLoopSale() {
    const { priceI } = useContext(LocationContext);
    let { width } = useWindowDimensions();
    let currency = '$';

    switch (priceI) {
        case 0:
            currency = '֏';
            break;
        case 1:
            currency = '$';
            break;
        case 2:
            currency = '€';
            break;
        case 3:
            currency = '₽';
            break;
        default:
            break;
    }
    const [items, setItems] = useState([]);
    const { request } = useHttp();

    let fetchItems = useCallback(async () => {
        try {
            let fetched = await request('/api/link/sale', 'GET', null);
            setItems(fetched);
        } catch (e) { }
    }, [request]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);


    if (!items && !items.length) {
        return (<div></div>)
    }

    let arr = [];
    items.map(el => {
        if (el) {
            arr.push({
                img: process.env.PUBLIC_URL + `/upload/${el.shortId}/${el.carouselImg ? el.carouselImg : el.avatarImg}`,
                id: el.shortId,
                prices: el.prices,
                newPrices: el.newPrices
            })
        }
        return el;
    })
    if (arr && arr.length) {
        let k = 22;
        let arrTmp = arr;
        while (k-- > 0) {
            arrTmp = arrTmp.concat(arr)
        }
        arr = arrTmp
    }



    const settings = {
        className: "center",
        centerPadding: "60px",
        slidesToShow: width > 860 ? 4 : 2,
        swipeToSlide: true,
        dots: false,
        slidesToScroll: 1,
        arrows: false,
    };
    return (
        <Slider {...settings}>
            {arr.map((el, i) => <div key={i} className="slide-is"><a href={`detail/${el.id}`}><img alt='' src={el.img} />
                <div className='prices-cont'>
                    <p className='newPrice'><span className='currency'>{currency}</span>{el.newPrices[priceI]}</p>
                    <p className='oldPrice'><span className='currency-old'>{currency}</span>{el.prices[priceI]}</p>
                </div></a></div>)}
        </Slider>
    );

}

