import * as yup from 'yup';

export const contactSchema = yup.object({
    email: yup.string().required('Email is required'),
    message: yup.string().required('Enter message please'),
    country: yup.string()
});