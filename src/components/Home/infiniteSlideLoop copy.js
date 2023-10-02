import React, { useCallback, useEffect, useState } from 'react';
import './infiniteSlideLoop.css';
// import useWindowDimensions from '../windowDimensions';
import Flickity from 'react-flickity-component'
import { useHttp } from '../../hooks/http.hooks';

export default function InfiniteSlideLoop() {
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

    const flickityOptions = {
        initialIndex: 2,
        autoPlay: false,
        prevNextButtons: true,
        pageDots: false,
        draggable: true,
        imagesLoaded: true,
        wrapAround: true,
        selectedAttraction: 0.015,
        continuousAutoPlay: false,
        autoPlaySkipCell: true,
        friction: 0.25
    }

    return (
        <Flickity
            className={'slideshow-is js-slideshow-is first-is'} // default ''
            elementType={'div'} // default 'div'
            options={flickityOptions} // takes flickity options {}
            disableImagesLoaded={false} // default false
            reloadOnUpdate // default false
            static // default false
        >
            {arr.map((el, i) =>
                <div key={i} className="slide-is"><a href={`detail/${el.id}`}><img alt='' src={el.img} /></a></div>)}
        </Flickity>

    );

}

