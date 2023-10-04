import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkUltraviolet', () => {
   const checker = new BradMiddleware()

   test(`Minimum ultraviolet boundary`, () =>
      expect(checker.checkUltraviolet(0)).toEqual(0))

   test(`Middle ultraviolet value`, () =>
      expect(checker.checkUltraviolet(8)).toEqual(8))

   test(`Maximum ultraviolet boundary`, () =>
      expect(checker.checkUltraviolet(16)).toEqual(16))

   test(`Value less than minimum ultraviolet`, () =>
      expect(checker.checkUltraviolet(-1)).toEqual(null))

   test(`Value greater than maximum ultraviolet`, () =>
      expect(checker.checkUltraviolet(17)).toEqual(null))
})
