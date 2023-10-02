import React, { useCallback, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useHttp } from '../../hooks/http.hooks';
import { AddToCardBtn } from '../../components/Cart/AddToCardBtn';
import Carousel, { Modal, ModalGateway } from "react-images";
import { LocationContext } from '../../context/LocationContext';

import './DetailPublic.css';

export const DetailPublic = () => {
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
    const { request, loading } = useHttp();
    const [item, setItem] = useState(null);
    const [size, setSize] = useState(0);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const shortId = useParams().id;
    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${shortId}`, 'GET', null);
            setItem(fetched);
        } catch (e) {
            alert(e.message)
        }
    }, [shortId, request]);

    useEffect(() => {
        getLink();
    }, [getLink]);


    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    if (loading || !item) {
        return <div style={{ marginTop: '150px' }}></div>
    }

    const imgAvatarT = process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`;
    const imgHoverT = process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.hoverImg}`;
    const imgAvatar = process.env.PUBLIC_URL + `/upload/${item.shortId}/${item.avatarImg}`;
    const imgHover = process.env.PUBLIC_URL + `/upload/${item.shortId}/${item.hoverImg}`;

    const img0 = new Image();
    const img1 = new Image();
    img0.src = process.env.PUBLIC_URL + `/upload/${item.shortId}/${item.avatarImg}`;
    img1.src = process.env.PUBLIC_URL + `/upload/${item.shortId}/${item.hoverImg}`;

    document.title = `${item.name}: ${item.description}`;

    const arrRoot = [imgAvatar];
    const arr = [imgAvatarT];

    if (imgHover !== imgAvatar) {
        arrRoot.push(imgHover);
        arr.push(imgHoverT);
    }

    item.collectionImg.forEach((el, i) => arrRoot.push(process.env.PUBLIC_URL + `/upload/${item.shortId}/${el}`));
    item.collectionImg.forEach((el, i) => {
        return (arr.push(process.env.PUBLIC_URL + `/upload/${item.shortId}/${el}`))
    })

    if (arr.length === 0) {
        return <div style={{ marginTop: '150px' }}></div>
    }

    return (
        <div className='detail-item'>
            <div className='detail-gallery'>
                <div className='gallery-thumb'>
                    <div className='thumb-wrapper'>
                        {arr.map((el, index) =>
                            <a href={'#' + index}><img alt='Avatar' src={el} className='item-thumb' key={'photo' + index} /></a>)
                        }
                    </div>
                </div>
                <div className='gallery-cont'>
                    {
                        arr.map((el, index) => {
                            if (el) {
                                return (
                                    <img alt='Avatar' id={index} src={el} className='item-img' key={'photo' + index}
                                        onClick={e => {
                                            openLightbox(e, { photo: el.replace('thumb.', '2'), index })
                                        }} />
                                )
                            }
                            else return ''
                        })
                    }
                </div>
                {viewerIsOpen ? (
                    <ModalGateway>
                        <Modal onClose={closeLightbox} className='modaled-photo'>
                            <Carousel
                                currentIndex={currentImage}
                                views={arrRoot.map(x => ({ src: x }))}
                            />
                        </Modal>
                    </ModalGateway>
                ) : null}

            </div>
            <div className='detail-info-cont'>
                <div className='detail-info'>
                    <h1>{item.name}</h1>
                    {
                        item.description &&
                        <p className='item-desc'>{item.description}</p>
                    }
                    <div className='prices-cont-det'>
                        {item.sale && <p className='item-price new-p'><span className='currency'>{currency}</span>{item.newPrices[priceI]}</p>}
                        <p className={`item-price ${item.sale ? 'old-p' : ''}`}><span className='currency-old'>{currency}</span>{item.prices[priceI]}</p>
                    </div>

                    <hr />

                    <ul className='detail-list-user'>
                        {
                            item.detailList.map((el, i) => <li key={i}>{el}</li>)
                        }
                    </ul>

                    <div className='selectSize'>
                        <select onChange={e => setSize(e.target.value)} className={false ? 'invalid-size' : ''}>
                            <option className='exists' value="0" >Select size:</option>
                            {item.existingSizes.length &&
                                item.existingSizes.map(el => {
                                    return (
                                        <React.Fragment>
                                            <option className='exists' value={el} disabled={el ? false : true}>
                                                {el}
                                            </option>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <br />
                    <AddToCardBtn item={item} size={size} />
                </div>
            </div>
        </div>
    )
}