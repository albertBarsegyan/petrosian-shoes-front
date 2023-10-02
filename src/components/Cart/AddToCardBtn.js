import React, { useContext, useState } from 'react';
import { CartContext, PriceContext } from '../../context/CartContext';
import { LocationContext } from '../../context/LocationContext';
import './AddToCardBtn.css'

export const AddToCardBtn = ({ item, size }) => {
    const { items, setItems } = useContext(CartContext);
    const { setTotalPrice } = useContext(PriceContext);
    const [toggleSizeError, setToggleSizeError] = useState(false)

    const { priceI } = useContext(LocationContext);

    const magic = () => {
        if (size === 0 || size === '0') {
            return;
        } else
            if (item) {
                if (items === null) {
                    item.sale ?
                        setItems([{ ...item, quantity: 1, size, sale: true }])
                        :
                        setItems([{ ...item, quantity: 1, size, sale: false }])

                    setTotalPrice(item.sale ? item.newPrices[priceI] : item.prices[priceI])
                } else {
                    let arr = items;
                    let i = arr.indexOf(arr.find(el => el.shortId === item.shortId && el.size === size));
                    if (i !== -1) {
                        arr[i] = { ...item, quantity: items[i].quantity + 1, size };
                        setItems(arr);
                        let tmp = 0;
                        arr.map(el => el.sale ? tmp += el.newPrices[priceI] : tmp += el.prices[priceI])
                        setTotalPrice(tmp)
                    } else {
                        arr.push({ ...item, quantity: 1, size, sale: item.sale });
                        setItems(arr);
                        let tmp = 0;
                        arr.map(el => el.sale ? tmp += el.newPrices[priceI] : tmp += el.prices[priceI])
                        setTotalPrice(tmp);
                    }
                }
            }
    }

    if (size) {
        return (
            <button name='masfuerte' onClick={() => { magic() }} className="btn-cart"><span name='masfuerte1'><span name='masfuerte2'>Add to Cart</span></span></button>
        )
    } else {
        return (
            <React.Fragment>
                <button onClick={() => setToggleSizeError(true)} className="btn-cart-inval">Add to Cart</button>
                {toggleSizeError && <p className="error">Please, select size first.</p>}
            </React.Fragment>
        )
    }
}