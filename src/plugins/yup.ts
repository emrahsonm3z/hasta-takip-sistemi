import { setLocale } from 'yup'

setLocale({
  mixed: {
    default: 'validation.invalid',
    required: 'validation.required',
    notType: 'validation.invalid',
  },
  string: {
    email: 'validation.email',
    min: 'validation.stringMin',
    max: 'validation.stringMax',
  },
  number: {
    min: 'validation.numberMin',
    max: 'validation.numberMax',
  },
})
