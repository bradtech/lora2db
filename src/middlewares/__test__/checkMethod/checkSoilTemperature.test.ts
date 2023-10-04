import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkSoilTemperature', () => {
   const checker = new BradMiddleware()

   test(`Minimum soil temperature boundary`, () =>
      expect(checker.checkSoilTemperature(-7)).toEqual(-7))

   test(`Middle soil temperature value`, () =>
      expect(checker.checkSoilTemperature(13)).toEqual(13))

   test(`Maximum soil temperature boundary`, () =>
      expect(checker.checkSoilTemperature(33)).toEqual(33))

   test(`Value less than minimum soil temperature`, () =>
      expect(checker.checkSoilTemperature(-8)).toEqual(null))

   test(`Value greater than maximum soil temperature`, () =>
      expect(checker.checkSoilTemperature(34)).toEqual(null))
})
