import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkSoilHumidity', () => {
   const checker = new BradMiddleware()

   test(`Minimum soil humidity boundary`, () =>
      expect(checker.checkSoilHumidity(0)).toEqual(0))

   test(`Middle soil humidity value`, () =>
      expect(checker.checkSoilHumidity(50)).toEqual(50))

   test(`Maximum soil humidity boundary`, () =>
      expect(checker.checkSoilHumidity(100)).toEqual(100))

   test(`Value less than minimum soil humidity`, () =>
      expect(checker.checkSoilHumidity(-1)).toEqual(null))

   test(`Value greater than maximum soil humidity`, () =>
      expect(checker.checkSoilHumidity(101)).toEqual(null))
})
