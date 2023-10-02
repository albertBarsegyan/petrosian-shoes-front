import React, { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../../context/LocationContext';
import { ToastContainer, toast } from 'react-toastify';
import { useHttp } from '../../hooks/http.hooks';
import validator from 'validator';
import 'react-toastify/dist/ReactToastify.css';
import './customMade.css';

function CustomMade() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [res, setRes] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { cityName, countryName } = useContext(LocationContext);
    const { request } = useHttp();
    const notifySuccess = () => toast('Successfully subscribed!', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        toastId: 'successSubscribe',
        type: "success"
    });

    const notifyErr = () => toast('Please enter valid email!', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        type: "error"
    });

    useEffect(() => {
        if (email !== '') {
            if (validator.isEmail(email)) {
                setEmailError(false);
            } else {
                setEmailError(true);
            }
        } else {
            setEmailError(false);
        }
    }, [email]);

    let isValid = email => validator.isEmail(email);

    let setSubmit = async () => {
        setIsSubmitted(true);
        if (!isValid(email)) {
            setEmailError(true);
            notifyErr();
        } else {
            try {
                let form = { email, location: `${cityName}, ${countryName}` };
                const data = await request('/api/link/email', 'POST', form);
                setRes(data.message);

                if (data.message !== 'Already subscribed') {
                    notifySuccess();
                }
            } catch (e) {
                alert(e.message)
            }
            setEmailError(false)
        }
    }
    return (
        <div className='customMadeCont'>
            <div className='cm-text-wrap'>
                <h1>SALES AND BRAND NEWS</h1>
                <p>We do not stop creating new models which will beautify and underline your fascination and fit you must. Subscribe to our sales and brand news for be in touch about our new prices and fresh collection. </p>
                <div className='subscribe-email-wrapper'>
                    <input onChange={e => setEmail(e.target.value)} className={`'subscribe-email' + ${emailError ? ' error-email-sub' : ''} + ${isValid(email) ? 'success-email-sub' : ''}`} type='email' placeholder="Type your email here.." />
                    {emailError && isSubmitted && <p className="error">Email is not valid</p>}
                    {res && !emailError && isSubmitted && <p className="success">{res}</p>}
                </div>
                <button className="subscribe-email-submit" onClick={() => setSubmit()}>Subscribe</button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ToastContainer />
        </div>
    );
}

export default CustomMade;