import { BradMiddleware } from '../../BradMiddleware'

describe('Function calculateDewpoint', () => {
   const checker = new BradMiddleware()

   test(`Minimum dewpoint boundary`, () => {
      expect(checker.calculateDewpoint(1, 100)).toEqual(1)
      expect(checker.calculateDewpoint(11, 50)).toEqual(1)
      expect(checker.calculateDewpoint(37.9, 10)).toEqual(1)
   })

   test(`Middle dewpoint value`, () => {
      expect(checker.calculateDewpoint(20, 100)).toEqual(20)
      expect(checker.calculateDewpoint(25.9, 70)).toEqual(20)
      expect(checker.calculateDewpoint(35.7, 40)).toEqual(20)
   })

   test(`Maximum dewpoint boundary`, () => {
      expect(checker.calculateDewpoint(40, 100)).toEqual(40)
      expect(checker.calculateDewpoint(53.7, 50)).toEqual(40)
      expect(checker.calculateDewpoint(91.2, 10)).toEqual(40)
   })

   test(`Value less than minimum dewpoint`, () => {
      expect(checker.calculateDewpoint(0, 100)).toEqual(0)
      expect(checker.calculateDewpoint(0, 50)).toEqual(0)
      expect(checker.calculateDewpoint(0, 0)).toEqual(0)
   })
})
