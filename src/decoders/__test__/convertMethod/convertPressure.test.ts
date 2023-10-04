import { expect, describe, test } from 'bun:test'
import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertPressure', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`Zero expected to be null`, () =>
      expect(decoder.convertPressure(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertPressure(1, 'b00s00')).toEqual(403))

   test(`middle value`, () =>
      expect(decoder.convertPressure(127, 'b00s00')).toEqual(743))

   test(`maximum value`, () =>
      expect(decoder.convertPressure(255, 'b00s00')).toEqual(1089))
})
