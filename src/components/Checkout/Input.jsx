import React from 'react';
import { useField, ErrorMessage } from 'formik';

export const Input = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <label className="input">
            <input className={`input__field ${meta.touched && meta.error && 'invalid-input'}`}
                {...field} {...props}
                placeholder=" " />
            <span htmlFor={field.name} className='input__label'>{label}</span>
            <p className='err'><ErrorMessage name={props.name} /></p>
        </label>
    )
}

export const Textarea = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <label className="input text-area">
            <textarea className={`input__field ${meta.touched && meta.error && 'invalid-input'}`}
                {...field} {...props} key={field.name + ';'}
                placeholder=" " />
            <span htmlFor={field.name} className='input__label'>{label}</span>
            <p className='err'><ErrorMessage name={props.name} /></p>
        </label>
    )
}
