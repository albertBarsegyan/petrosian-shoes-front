import { createContext } from 'react';


export const CartContext = createContext({
    items: null,
    setItems: () => { }
})

export const PriceContext = createContext({
    totalPrice: 0,
    setTotalPrice: () => { }
})

export const SaleContext = createContext({
    sale: false,
    setSale: () => { }
})

export const LengthContext = createContext({
    length: 0,
    setLength: () => { }
})