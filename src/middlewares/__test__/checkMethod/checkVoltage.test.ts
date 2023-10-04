import { BradMiddleware } from '../../BradMiddleware'

describe('Function checkVoltage', () => {
   const checker = new BradMiddleware()

   test(`Minimum voltage boundary`, () =>
      expect(checker.checkVoltage(3.3)).toEqual({ voltage: 3.3, percent: 0 }))

   test(`Middle voltage value`, () =>
      expect(checker.checkVoltage(3.9)).toEqual({ voltage: 3.9, percent: 66.7 }))

   test(`Maximum voltage boundary`, () =>
      expect(checker.checkVoltage(4.2)).toEqual({
         voltage: 4.2,
         percent: 100,
      }))

   test(`Value less than minimum voltage`, () =>
      expect(checker.checkVoltage(3.2)).toEqual({
         voltage: null,
         percent: null,
      }))

   test(`Value greater than maximum voltage`, () =>
      expect(checker.checkVoltage(4.3)).toEqual({
         voltage: null,
         percent: null,
      }))
})
