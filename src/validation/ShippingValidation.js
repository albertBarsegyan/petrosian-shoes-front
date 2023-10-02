import * as yup from 'yup';

export const shippingSchema = yup.object({
    email: yup.string().email('Email must be valid').max(255).required('Email is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    country: yup.string().required('Country is required'),
    region: yup.string().required('Region is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    postal: yup.number().required('Postal code is required'),
});

