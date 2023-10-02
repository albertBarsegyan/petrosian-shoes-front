import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hooks';
import { useMessage } from '../../hooks/message.hook';
import './AuthPage.css'

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({
        login: '', password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form });
            message(data.message)
        } catch (e) { }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { ...form });
            auth.login(data.token, data.userId);
        } catch (e) { }
    }

    return (
        <div className='login'>
            <h1>Admin page</h1>
            <div>
                <div className="input-field">
                    <label htmlFor="login">Login</label>
                    <input
                        placeholder="Login"
                        id="login"
                        name='login'
                        type="text"
                        value={form.login}
                        className="yellow-input"
                        onChange={changeHandler}
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input
                        placeholder="password"
                        id="password"
                        type="password"
                        name='password'
                        value={form.password}
                        className="yellow-input"
                        onChange={changeHandler}
                    />
                </div>
                <div className="card-action">
                    <button onClick={loginHandler}>login</button>
                </div>
            </div>
        </div>
    )
};