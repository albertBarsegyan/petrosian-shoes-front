import { useState, useCallback, useContext } from 'react';
import { LengthContext } from '../context/CartContext';
const storageName = 'cartItems';

export const useCart = () => {
    const [items, setItems] = useState(null);
    const { setLength } = useContext(LengthContext);

    const set = useCallback((items) => {
        setItems(items)
        if (items && items.length) {
            let lengthTemp = 0;
            items.map(el => lengthTemp += el.quantity);
            setLength(lengthTemp);
        }
        localStorage.setItem(storageName, JSON.stringify({ items }));
    }, []);

    const get = useCallback(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if (data && data.items) {
            setItems(data.items);
            if (data.items && data.items.length) {
                let lengthTemp = 0;
                data.items.map(el => lengthTemp += el.quantity);
                setLength(lengthTemp);
            }
            return data.items;
        }
        return null;
    }, []);

    return { set, get, items, setItems };
}