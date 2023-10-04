import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertUV', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`over 16 expected to be null`, () =>
      expect(decoder.convertUV(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertUV(1, 'b00s00')).toEqual(0))

   test(`middle value`, () => expect(decoder.convertUV(9, 'b00s00')).toEqual(8))

   test(`maximum value`, () =>
      expect(decoder.convertUV(17, 'b00s00')).toEqual(16))
})
