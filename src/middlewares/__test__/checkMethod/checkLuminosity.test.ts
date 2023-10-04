import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkLuminosity', () => {
   const checker = new BradMiddleware()

   test(`Minimum luminosity boundary`, () =>
      expect(checker.checkLuminosity(5)).toEqual(5))

   test(`Middle luminosity value`, () =>
      expect(checker.checkLuminosity(60000)).toEqual(60000))

   test(`Maximum luminosity boundary`, () =>
      expect(checker.checkLuminosity(120000)).toEqual(120000))

   test(`Value less than minimum luminosity`, () =>
      expect(checker.checkLuminosity(4)).toEqual(null))

   test(`Value greater than maximum luminosity`, () =>
      expect(checker.checkLuminosity(120001)).toEqual(null))
})
