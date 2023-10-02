import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Collections.css';

import { LocationContext } from '../../context/LocationContext';


export const Collections = ({ items }) => {
    if (!items || !items.length) {
        return <div></div>
    }
    let arr = [];
    items.map(el => arr.unshift(el));
    items = arr;

    const { priceI } = useContext(LocationContext);
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
    return (
        <div className='collections'>
            <div className='gallery'>
                {items.map(item => {
                    const [img, setImg] = useState(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`);

                    return (
                        <Link to={`/detail/${item.shortId}`} key={item.shortId}>
                            <img
                                alt='Avatar'
                                src={img}
                                onMouseOut={() => { setImg(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`) }}
                                onMouseEnter={() => { setImg(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.hoverImg}`) }}
                            />
                            <div className='item-name-coll'><strong>{item.name}</strong></div>
                            {item.sale &&
                                <div className='prices-cont'>
                                    <p className='newPrice'><span className='currency'>{currency}</span>{item.newPrices[priceI]}</p>
                                    <p className='oldPrice'><span className='currency-old'>{currency}</span>{item.prices[priceI]}</p>
                                </div>}
                            {
                                !item.sale &&
                                <div className='prices-cont'>
                                    <p className='newPrice'>{currency} {item.prices[priceI]}</p>
                                </div>
                            }
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export const CollectionsWithPrice = ({ items }) => {
    const { priceI } = useContext(LocationContext);
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

    if (!items || !items.length) {
        return <div></div>
    }
    return (
        <div className='collections'>
            <div className='gallery'>
                {items.map(item => {
                    const [img, setImg] = useState(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`);

                    return (
                        <Link to={`/detail/${item.shortId}`} key={item.shortId}>
                            <img
                                alt='Avatar'
                                src={img}
                                onMouseOut={() => { setImg(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`) }}
                                onMouseEnter={() => { setImg(process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.hoverImg}`) }}
                            />
                            <div className='item-name-coll'><strong>{item.name}</strong></div>
                            <div className='prices-cont'>
                                <p className='newPrice'><span className='currency'>{currency}</span>{item.newPrices[priceI]}</p>
                                <p className='oldPrice'><span className='currency-old'>{currency}</span>{item.prices[priceI]}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};


