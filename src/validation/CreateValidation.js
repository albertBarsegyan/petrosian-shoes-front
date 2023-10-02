import * as yup from 'yup';

export const createSchema = yup.object({
    shortId: yup.string(),
    clicks: yup.string(),
    date: yup.string(),
    type: yup.string().required('Type is required'),
    prices: yup.array().required('Required'),
    description: yup.string(),
    detailList: yup.array(),
    avatar: yup.string().required('Avatar is required'),
    hover: yup.string(),
    collectionImg: yup.array()
});