import React, { useCallback, useEffect, useState } from 'react';
import Slider from "react-slick";
import { useHttp } from "../../hooks/http.hooks";

export default function SwipeToSlide() {
    const [items, setItems] = useState([]);
    const { request } = useHttp();

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
                img: process.env.PUBLIC_URL + `/upload/${el.shortId}/thumb.${el.avatarImg}`,
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
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 4,
        swipeToSlide: true,
        cssEase: "linear",
        dots: false,
        slidesToScroll: 1,
    };
    return (
        <div>
            <h2>Swipe To Slide</h2>
            <Slider {...settings}>
                {arr.map((el, i) => <div key={i} className="slide-is"><a href={`detail/${el.id}`}><img alt='' src={el.img} /></a></div>)}
            </Slider>
        </div>
    );

}