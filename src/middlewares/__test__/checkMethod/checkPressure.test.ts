import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkPressure', () => {
   const checker = new BradMiddleware()

   test(`Minimum pressure boundary`, () =>
      expect(checker.checkPressure(400)).toEqual(400))

   test(`Middle pressure value`, () =>
      expect(checker.checkPressure(741.5)).toEqual(741.5))

   test(`Maximum pressure boundary`, () =>
      expect(checker.checkPressure(1083.8)).toEqual(1083.8))

   test(`Value less than minimum pressure`, () =>
      expect(checker.checkPressure(399)).toEqual(null))

   test(`Value greater than maximum pressure`, () =>
      expect(checker.checkPressure(1083.9)).toEqual(null))
})
