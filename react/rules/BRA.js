import moment from 'moment'
import msk from 'msk'
import Phone from '@vtex/phone'
import brazil from '@vtex/phone/countries/BRA'

const maskPhone = value =>
  value.length === 14
    ? msk.fit(value, '(99) 9999-9999')
    : msk.fit(value, '(99) 99999-9999')

export default {
  country: 'BRA',
  personalFields: [
    {
      name: 'firstName',
      maxLength: 100,
      label: 'firstName',
      required: true,
    },
    {
      name: 'lastName',
      maxLength: 100,
      label: 'lastName',
      required: true,
    },
    {
      name: 'email',
      maxLength: 100,
      label: 'email',
      hidden: true,
    },
    {
      name: 'document',
      maxLength: 50,
      label: 'cpf',
      mask: value => msk.fit(value, '999.999.999-99'),
      validate: value => {
        const cleanValue = value.replace(/[^\d]/g, '')
        if (cleanValue.length != 11) return false

        const isRepeatedNum = '0123456789'
          .split('')
          .some(digit => digit.repeat(11) === cleanValue)
        if (isRepeatedNum) return false

        const firstReduce = cleanValue
          .split('')
          .slice(0, 9)
          .reduce((acc, cur, index) => acc + parseInt(cur) * (10 - index), 0)
        const firstDigit = ((firstReduce * 10) % 11) % 10
        if (firstDigit != cleanValue.charAt(9)) return false

        const secondReduce = cleanValue
          .split('')
          .slice(0, 10)
          .reduce((acc, cur, index) => acc + parseInt(cur) * (11 - index), 0)
        const secondDigit = ((secondReduce * 10) % 11) % 10
        return secondDigit == cleanValue.charAt(10)
      },
    },
    {
      name: 'homePhone',
      maxLength: 30,
      label: 'homePhone',
      mask: maskPhone,
      validate: value => Phone.validate(value, '55'),
      display: maskPhone,
      submit: value => value.replace(/[^\d]/g, ''),
    },
    {
      name: 'gender',
      maxLength: 30,
      label: 'gender',
    },
    {
      name: 'birthDate',
      maxLength: 30,
      label: 'birthDate',
      mask: value => msk.fit(value, '99/99/9999'),
      validate: value => moment(value, 'DD/MM/YYYY', true).isValid(),
      display: value => moment(value).format('DD/MM/YYYY'),
      submit: value => moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    },
  ],
  businessFields: [
    {
      name: 'corporateName',
      maxLength: 100,
      label: 'corporateName',
    },
    {
      name: 'corporateDocument',
      maxLength: 30,
      label: 'cnpj',
      mask: value => msk.fit(value, '99.999.999/9999-99'),
      validate: value => {
        const cleanValue = value.replace(/[^\d]/g, '')
        if (cleanValue.length != 14) return false

        const isRepeatedNum = '0123456789'
          .split('')
          .some(digit => digit.repeat(14) === cleanValue)
        if (isRepeatedNum) return false

        const firstWeights = '543298765432'.split('')
        const firstReduce = cleanValue
          .split('')
          .slice(0, 12)
          .reduce(
            (acc, cur, index) =>
              acc + parseInt(cur) * parseInt(firstWeights[index]),
            0,
          )
        const firstDigit = firstReduce % 11 < 2 ? 0 : 11 - (firstReduce % 11)
        if (firstDigit != cleanValue.charAt(12)) return false

        const secondWeights = ['6', ...firstWeights]
        const secondReduce = cleanValue
          .split('')
          .slice(0, 13)
          .reduce(
            (acc, cur, index) =>
              acc + parseInt(cur) * parseInt(secondWeights[index]),
            0,
          )
        const secondDigit = secondReduce % 11 < 2 ? 0 : 11 - (secondReduce % 11)
        return secondDigit == cleanValue.charAt(13)
      },
    },
    {
      name: 'businessPhone',
      maxLength: 30,
      label: 'businessPhone',
      mask: maskPhone,
      validate: value => Phone.validate(value, '55'),
      display: maskPhone,
      submit: value => value.replace(/[^\d]/g, ''),
    },
    {
      name: 'stateRegistration',
      maxLength: 50,
      label: 'stateRegistration',
    },
    {
      name: 'tradeName',
      maxLength: 100,
      label: 'tradeName',
    },
  ],
}
