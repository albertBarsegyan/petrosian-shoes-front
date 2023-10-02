import React, { useCallback, useEffect, useState } from 'react';
import './infiniteSlideLoop.css';
import { useHttp } from '../../hooks/http.hooks';
import Slider from 'react-slick';
import useWindowDimensions from '../windowDimensions';

export default function InfiniteSlideLoop() {
    const [items, setItems] = useState([]);
    const { request } = useHttp();
    let { width } = useWindowDimensions();

    let fetchItems = useCallback(async () => {
        try {
            let fetched = await request('/api/link/', 'GET', null);
            setItems(fetched);
        } catch (e) { }
    }, [request]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    let arr = [];
    items.map(el => {
        if (el && !el.sale && el.carousel) {
            arr.push({
                img: process.env.PUBLIC_URL + `/upload/${el.shortId}/${el.carouselImg ? el.carouselImg : el.avatarImg}`,
                id: el.shortId,
                prices: el.prices
            })
        }
        return el
    })
    if (arr && arr.length) {
        let k = 10;
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
            {arr.map((el, i) => <div key={i} className="slide-is"><a href={`detail/${el.id}`}><img alt='' src={el.img} /></a></div>)}
        </Slider>
    );

}

