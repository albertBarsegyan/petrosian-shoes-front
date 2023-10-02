import React from 'react';
import { useField, ErrorMessage } from 'formik';

export const Input = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="input-field">
            <label htmlFor={field.name}>{label}</label>
            <input {...field} {...props} />
            <p className='err'><ErrorMessage name={props.name} /></p>
        </div>
    )
}

export const Select = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="input-field">
            <label htmlFor={field.name}>{label}</label>
            <select {...field} {...props} className={`${meta.touched && meta.error && 'invalid-input'}`}>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Accessories">Accessories</option>
            </select>
            <p className='err'><ErrorMessage name={props.name} /></p>
        </div>
    )
}