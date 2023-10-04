import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkAirTemperature', () => {
   const checker = new BradMiddleware()

   // test inside a greenHouse
   test(`Minimum air temperature boundary in greenHouse`, () =>
      expect(checker.checkAirTemperature(-40, 'Y')).toEqual(-40))

   test(`Middle air temperature value in greenHouse`, () =>
      expect(checker.checkAirTemperature(10, 'Y')).toEqual(10))

   test(`Maximum air temperature boundary in greenHouse`, () =>
      expect(checker.checkAirTemperature(60, 'Y')).toEqual(60))

   test(`Value less than minimum air temperature in greenHouse`, () =>
      expect(checker.checkAirTemperature(-41, 'Y')).toEqual(null))

   test(`Value greater than maximum air temperature in greenHouse`, () =>
      expect(checker.checkAirTemperature(61, 'Y')).toEqual(null))

   //test outside a greenhouse
   test(`Minimum air temperature boundary in greenHouse`, () =>
      expect(checker.checkAirTemperature(-19)).toEqual(-19))

   test(`Middle air temperature value in greenHouse`, () =>
      expect(checker.checkAirTemperature(10.5)).toEqual(10.5))

   test(`Middle air temperature value in greenHouse`, () =>
      expect(checker.checkAirTemperature(11)).toEqual(10.9))

   test(`Maximum air temperature boundary in greenHouse`, () =>
      expect(checker.checkAirTemperature(45)).toEqual(29))
})
