import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkAirHumidity', () => {
   const checker = new BradMiddleware()

   test(`Minimum air humidity boundary`, () =>
      expect(checker.checkAirHumidity(0)).toEqual(0))

   test(`Middle air humidity value`, () =>
      expect(checker.checkAirHumidity(50)).toEqual(50))

   test(`Maximum air humidity boundary`, () =>
      expect(checker.checkAirHumidity(100)).toEqual(100))

   test(`Value less than minimum air humidity`, () =>
      expect(checker.checkAirHumidity(-1)).toEqual(null))

   test(`Value greater than maximum air humidity`, () =>
      expect(checker.checkAirHumidity(101)).toEqual(null))
})
