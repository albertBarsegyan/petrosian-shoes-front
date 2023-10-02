import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext, PriceContext } from '../../context/CartContext';
import './Cart.css';
import { useCart } from '../../hooks/cart.hook'
import { LocationContext } from '../../context/LocationContext';

function Cart(props) {
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

    const { items, setItems } = useContext(CartContext);
    const { totalPrice, setTotalPrice } = useContext(PriceContext);
    const [isVisible, setIsVisible] = useState(props.visible);
    const [quantities, setQuantites] = useState([]);

    // cart visibility
    useEffect(() => {
        if (items && items.length > 0) {
            items && items.length > 0 && props.visible ? setIsVisible(true) : setIsVisible(false);

            let tmp = 0;
            items.map(el => tmp += el.sale ? el.newPrices[priceI] * el.quantity : el.prices[priceI] * el.quantity)
            if (tmp)
                setTotalPrice(tmp)
        }
    }, [items, props.visible])

    useEffect(() => {
        if (items && items.length > 0) {
            let tmp = 0;
            items.map(el => tmp += el.sale ? el.newPrices[priceI] * el.quantity : el.prices[priceI] * el.quantity)
            if (tmp)
                setTotalPrice(tmp)

        }
    }, [items])

    useEffect(() => {
        let tmp = 0;
        if (items) {
            items.map(el => tmp += el.sale ? el.newPrices[priceI] * el.quantity : el.prices[priceI] * el.quantity)
        }
        setTotalPrice(tmp)
    }, [totalPrice])

    if (!items || !items.length) {
        return (
            <div className="container-cart" style={{ visibility: isVisible ? "visible" : "hidden" }}>
                <div className="shopping-cart">
                    <h1>Empty</h1>
                </div>
            </div>
        );
    }


    function totalPriceString(totalPrice) {
        let stringed = totalPrice;
        if (stringed > 0) {
            stringed = String(stringed);
            if (stringed.length) {
                for (let i = 0; i < stringed.length; i++) {
                    if (i >= 3 && i - 1 % 2 === 0) {
                        stringed[i] = ',' + stringed[i - 1];

                    }
                }
            }
        }
        return stringed;
    }

    return (
        <div className="container-cart" style={{ visibility: isVisible ? "visible" : "hidden" }}>
            <div className="shopping-cart">
                <ul className="shopping-cart-items">
                    {items && items.map((item, i) => <ItemCart props={{ item, items, setItems, i, totalPrice, setTotalPrice, setIsVisible, quantities, setQuantites }} key={i} />)}
                </ul>
                <div className="shopping-cart-header">
                    <div className="shopping-cart-total">
                        <span className="lighter-text">Total: </span>
                        <span className="main-color-text"><span className='currency-old'>{currency}</span>{totalPriceString(totalPrice)}</span>
                    </div>
                </div>
                <Link to='/checkout/pay' onClick={() => { setIsVisible(false) }} className="button">Checkout</Link>
            </div>
        </div>
    );
}

function ItemCart({ props }) {
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
    const { set } = useCart();
    const item = props.item;
    let i = props.i;

    let arr = [props.items];
    if (props.items) {
        arr.push(props.items.length);
    }
    useEffect(() => {
        i = props.items.indexOf(props.items.find(el => el.shortId === props.item.shortId && el.size === props.item.size));
    }, arr)

    let price = item.sale ? item.newPrices[priceI] : item.prices[priceI];
    const [quantity, setQuantity] = useState(item.quantity);
    const [increment, setIncrement] = useState(false)

    function getTotalPrice(it) {
        if (it.sale) return it.quantity * it.newPrices[priceI]
        return it.quantity * it.prices[priceI]
    }

    const deleteItem = () => {
        props.setTotalPrice(props.totalPrice - getTotalPrice(props.items[i]));
        let arr = props.items;
        arr.splice(i, 1)
        props.setItems(arr);

        let tmp = 0;
        props.items.map(el => tmp += el.sale ? el.newPrices[priceI] * el.quantity : el.prices[priceI] * el.quantity)
        props.setTotalPrice(tmp)
        arr = props.quantities;
        arr.splice(i, 1);
        props.setQuantites(arr);

        if (arr.length === 0) {
            props.setIsVisible(false);
            props.setItems(null);
            props.setTotalPrice(0);
        }
    }

    useEffect(() => {
        props.setQuantites(props.items.map(el => el.quantity));
        if (increment) {
            setIncrement(false);
            if (quantity > props.items[i].quantity) {
                props.items[i].quantity += 1;
                props.setTotalPrice(+props.totalPrice + price);
            } else if (props.items[i].quantity > 1) {
                props.items[i].quantity -= 1;
                props.setTotalPrice(+props.totalPrice - price);
            }
        }

        if (quantity === props.items[i].quantity) {
            let temp = 0;
            props.items.map(el => temp += el.quantity * price)
            props.setTotalPrice(temp);

        } else {
            setQuantity(props.items[i].quantity);
        }
        set(props.items);

    }, [quantity, props.items, props.items[i].quantity]);

    return (
        <div>
            <li className="clearfix">
                <img src={process.env.PUBLIC_URL + `/upload/${item.shortId}/thumb.${item.avatarImg}`} width='70' alt="Item" />
                <div className='shop-item-detail-cont'>
                    <div><span className="item-name">{item.name}</span></div>
                    <div><span className="item-price"><span className='currency-old'>{currency}</span>{price}</span></div>
                    <div><span className="item-size">Size: {item.size}</span></div>
                    <div className='quantity'>
                        <span className="item-quantity">Quantity: {props.items[i].quantity}</span>
                        <div className='quantity-but'>
                            <button className='addBtn' onClick={() => { setIncrement(true); setQuantity(props.items[i].quantity + 1) }}></button>

                            <button className='minusBtn' style={{ display: quantity === 1 ? 'none' : 'initial' }} onClick={() => { if (props.items[i].quantity > 1) { setIncrement(true); setQuantity(props.items[i].quantity - 1) } }}></button>
                        </div>
                    </div>
                </div>

                <button className='deletefromCart' name='deletefromCart' onClick={() => { deleteItem() }}></button>
            </li>
        </div>
    )
}

export default Cart;