import './Navbar.css';
import logo from './logo.png';
import trolley from './trolley.png';
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { NavLink } from 'react-router-dom'
import Cart from '../Cart/Cart';
import { CartContext, LengthContext } from '../../context/CartContext';
import { useHttp } from '../../hooks/http.hooks';

import styled, { keyframes } from 'styled-components';

const slide1 = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: .95;
    }`;
const Wrapper = styled.div``;
const Wrapper1 = styled.div``;
const BouncyDiv = styled.div`
${Wrapper}:hover & {
    display: flex;
    opacity: .95;
  animation: .4s ${slide1};
}`;
const BouncyDiv1 = styled.div`
${Wrapper1}:hover & {
    display: flex;
    opacity: .95;
  animation: .4s ${slide1};
}`;

const Navbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [salesMan, setSalesMan] = useState(false);
    const [salesWoman, setSalesWoman] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [visibleNav, setVisibleNav] = useState(true);
    // const [arrowClassM, setArrowClassM] = useState('down');
    // const [arrowClassW, setArrowClassW] = useState('down');

    const [cartVisibility, setCartVisibility] = useState(false);
    const [cartButtonVisibility, setCartButtonVisibility] = useState(false);
    const { items } = useContext(CartContext);
    const { length, setLength } = useContext(LengthContext);

    const { request } = useHttp();

    let fetchItems = useCallback(async () => {
        try {
            let fetched = await request('/api/link/sale', 'GET', null);
            if (fetched && fetched.length) {
                fetched.map(el => el.type === "Man" ? setSalesMan(true) : setSalesWoman(true))
            }
        } catch (e) { }
    }, [request]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const refCart = useRef();
    const refMenu = useRef();

    const manDrop = useRef();
    const womanDrop = useRef();

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisibleNav((prevScrollPos > currentScrollPos) || currentScrollPos < 100);
        setPrevScrollPos(currentScrollPos);
    };

    useOutsideClick(refCart, () => {
        if (cartVisibility) {
            setCartVisibility(false);
        }
    }, setCartVisibility, setVisibleNav);

    useOutsideClick2(refMenu, () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    });

    // cart button visibility
    useEffect(() => {
        if (items && items.length) {
            setCartButtonVisibility(true);
            let lengthTemp = 0;
            items.map(el => lengthTemp += el.quantity);
            setLength(lengthTemp);
        } else {
            setCartButtonVisibility(false);
        }
    }, [items]);

    // if there is no navbar
    useEffect(() => {
        if (!visibleNav) {
            setCartVisibility(false);
            setIsMenuOpen(false);
        }
    }, [visibleNav])

    // on scroll handle navbar visibility
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);

    }, [prevScrollPos, visibleNav, handleScroll]);

    return (
        <div className='navHolder' style={{ top: visibleNav ? '0' : '-150px', position: 'fixed', zIndex: 100 }} ref={refCart}>
            <div className='prenav'>free shipping</div>
            <nav className="navbar" >
                <NavLink className='logo-cont' onClick={() => { setCartVisibility(false); window.scrollTo(0, 0); }} to='/'>
                    <img className='logo' src={logo} alt='Petrosian' />
                </NavLink>
                <div className='navbar-items'>
                    <div className='navbar-left'>
                        <Wrapper1 className='dropdown-man'
                        // onMouseOver={() => { setArrowClassM('up'); manDrop.current.classList.add('opened-drop') }}
                        // onMouseOut={() => { setArrowClassM('down'); manDrop.current.classList.remove('opened-drop') }}
                        >
                            <NavLink className='man-nav' onClick={() => { setCartVisibility(false) }} to="/man">Man<i className={`arrow down`}></i></NavLink>
                            <BouncyDiv1 className='man-nav-dropdown' ref={manDrop} style={{ display: !visibleNav ? "none" : '' }}>
                                <div className='equalize'></div>
                                <div className='drop-cont'>
                                    <NavLink to='/man'>All</NavLink>
                                    <NavLink to='/man/spring-summer'>Spring / Summer</NavLink>
                                    <NavLink to='/man/autumn-winter'>Autumn / Winter</NavLink>
                                    {salesMan && <NavLink to='/sale/man'>Sale</NavLink>}
                                </div>
                            </BouncyDiv1>
                        </Wrapper1>
                        <Wrapper className='dropdown-woman'
                        // onMouseOver={() => { setArrowClassW('up') }}
                        // onMouseOut={() => { setArrowClassW('down') }}
                        >
                            <NavLink className='woman-nav' onClick={() => { setCartVisibility(false) }} to="/woman">Woman<i className={`arrow down`}></i></NavLink>
                            <BouncyDiv className='woman-nav-dropdown' ref={womanDrop} style={{ display: !visibleNav ? "none" : '' }}>
                                <div className='equalize'></div>
                                <div className='drop-cont'>
                                    <NavLink to='/woman'>All</NavLink>
                                    <NavLink to='/woman/spring-summer'>Spring / Summer</NavLink>
                                    <NavLink to='/woman/autumn-winter'>Autumn / Winter</NavLink>
                                    {salesWoman && <NavLink to='/sale/woman'>Sale</NavLink>}
                                </div>
                            </BouncyDiv>
                        </Wrapper>
                    </div>
                    <div className='navbar-right'>
                        <div className='navbar-right-holder'>
                            <NavLink onClick={() => { setCartVisibility(false) }} to="/contact">Contact</NavLink>
                        </div>
                    </div>
                </div>
                {items && items.length && <button style={{ display: cartButtonVisibility ? 'initial' : 'none', zIndex: 1000 }} onClick={() => { setCartVisibility(!cartVisibility) }} className='cart-button-nav'>
                    <img className='trolley' src={trolley} alt='' />
                    <span className='trolley-count'>{length}</span>
                </button>
                }
                <div className='menuButton' onClick={() => {
                    setCartVisibility(false);
                    setTimeout(() => {
                        if (isMenuOpen) {
                            setIsMenuOpen(false)
                        } else {
                            setIsMenuOpen(true)
                        }
                    })
                }}>
                    <svg className={`ham hamRotate ham1 ${isMenuOpen ? 'active' : ''}`} viewBox="0 0 100 100" width="80" >
                        <path
                            className="line top"
                            d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
                        <path
                            className="line middle"
                            d="m 30,50 h 40" />
                        <path
                            className="line bottom"
                            d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
                    </svg>
                </div>
            </nav>

            <div className='navbarToggle' style={{ display: isMenuOpen ? 'flex' : 'none' }} ref={refMenu}>
                <NavLink onClick={() => { setCartVisibility(false); setIsMenuOpen(false) }} to="/man">Man</NavLink>
                <NavLink onClick={() => { setCartVisibility(false); setIsMenuOpen(false) }} to="/woman">Woman</NavLink>
                <NavLink onClick={() => { setCartVisibility(false); setIsMenuOpen(false) }} to="/contact">Contact</NavLink>
            </div>
            <Cart visible={cartVisibility} />
        </div>
    );
};

const useOutsideClick = (ref, callback, setCartVisibility, setVisibleNav) => {
    const handleClick = e => {
        if (e.target.name === 'masfuerte' || e.target.outerText === 'ADD TO CART' || e.target.name === 'masfuerte2') {
            setCartVisibility(false);
            setCartVisibility(true);
            setVisibleNav(true);
        } else if (e.target.name !== 'deletefromCart' && ref.current && (!ref.current.contains(e.target))) {
            callback();
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        }
    })
}

const useOutsideClick2 = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && (!ref.current.contains(e.target))) {
            callback()
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        }
    })
}

export default Navbar;