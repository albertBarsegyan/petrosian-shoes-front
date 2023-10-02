import React, { useContext } from 'react';
import { Formik, Form } from 'formik'
import { Input, Textarea } from '../../components/Checkout/Input';
import { contactSchema } from '../../validation/ContactValidation'
import { useHttp } from '../../hooks/http.hooks'
import { LocationContext } from '../../context/LocationContext';
import { ToastContainer, toast } from 'react-toastify';
import './Contact.css'

function Contact() {
    const { cityName, countryName } = useContext(LocationContext);
    const { request } = useHttp();

    const notifySuccess = () => toast('Email was sent!', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        type: "success"
    });

    return (
        <Formik
            validationSchema={contactSchema}
            initialValues={{
                email: '',
                message: ''
            }}
            onSubmit={async (values) => {
                try {
                    notifySuccess();
                    await request('/api/email/emailContact', 'POST', { ...values, location: `${cityName}, ${countryName}` });
                } catch (e) {
                    // console.log(e.message)
                }
            }}
        >
            {formik => (
                <div className='contact'>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <ToastContainer />
                    <Form>
                        <h1>Contact & Support</h1>
                        <Input label='Email' name='email' type='email' />
                        <Textarea label='Message' name='message' type='textarea' height='400' />
                        <button type='submit' className='button'>Send</button>
                    </Form>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190.513708388459!2d44.50750318615097!3d40.18193200281355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abcfdbd9be4db%3A0x5887b68a83cc8d18!2s18a%20Mesrop%20Mashtots%20Ave%2C%20Yerevan%2C%20Armenia!5e0!3m2!1sen!2s!4v1639334320207!5m2!1sen!2s"
                        width="600"
                        height="450"
                        style={{ border: 0, width: '100%', }}
                        allowfullscreen=""
                        loading="lazy"
                        title="PetrosianShoes location"
                    />

                    <div className='contacts-wrap'>
                        {/* <p>Telephone: <a href="tel:+37493562852">+374 93 562 852</a></p> */}
                        <p>Email: <a href="mailto:support@petrosianshoes.com">support@petrosianshoes.com</a></p>
                    </div>
                </div>
            )}
        </Formik>
    );
}

export default Contact;