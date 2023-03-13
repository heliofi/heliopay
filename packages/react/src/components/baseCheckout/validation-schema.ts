import * as yup from 'yup';

const validationSchema = yup.object({
  fullName: yup.string().when('requireFullName', {
    is: true,
    then: yup.string().required('Full name is required'),
  }),
  customPrice: yup.number().when('canChangePrice', {
    is: true,
    then: yup.number().required('Price is required'),
  }),
  quantity: yup.number().when('canChangeQuantity', {
    is: true,
    then: yup
      .number()
      .typeError('Quantity has to be a number')
      .positive('Quantity must be a positive number')
      .required('Quantity is required'),
  }),
  email: yup.string().when('requireEmail', {
    is: true,
    then: yup.string().email().required('E-mail address is required'),
  }),
  discordUsername: yup.string().when('requireDiscordUsername', {
    is: true,
    then: yup.string().required('Discord username is required'),
  }),
  twitterUsername: yup.string().when('requireTwitterUsername', {
    is: true,
    then: yup.string().required('Twitter username is required'),
  }),
  phoneNumber: yup.string().when('requirePhoneNumber', {
    is: true,
    then: yup.string().required('Phone number is required'),
  }),
  country: yup.string().when('requireCountry', {
    is: true,
    then: yup.string().required('Country is required'),
  }),
  deliveryAddress: yup.string().when('requireDeliveryAddress', {
    is: true,
    then: yup.string().required('Shipping address is required'),
  }),
  city: yup.string().when('requireDeliveryAddress', {
    is: true,
    then: yup.string().required('City is required'),
  }),
  street: yup.string().when('requireDeliveryAddress', {
    is: true,
    then: yup.string().required('Street is required'),
  }),
  streetNumber: yup.string().when('requireDeliveryAddress', {
    is: true,
    then: yup.string().required('Street number is required'),
  }),
  areaCode: yup.string().when('requireDeliveryAddress', {
    is: true,
    then: yup.string().required('Area code is required'),
  }),
  productValue: yup.string().when('requireProductDetails', {
    is: true,
    then: yup.string().required('This is required'),
  }),
});

export default validationSchema;
