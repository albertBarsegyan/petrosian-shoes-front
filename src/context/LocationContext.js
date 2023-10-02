import { createContext } from 'react';


export const LocationContext = createContext({
    cityName: null,
    setCityName: () => { },
    countryName: null,
    setCountryName: () => { },
    timezone: null,
    setTimezone: () => { },
    priceI: 1,
    setPriceI: () => { },
})