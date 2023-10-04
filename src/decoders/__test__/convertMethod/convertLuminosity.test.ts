import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertLuminosity', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`Zero expected to be null`, () =>
      expect(decoder.convertLuminosity(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertLuminosity(1, 'b00s00')).toEqual(5))

   test(`middle value`, () =>
      expect(decoder.convertLuminosity(128, 'b00s00')).toEqual(60012.5))

   test(`maximum value`, () =>
      expect(decoder.convertLuminosity(255, 'b00s00')).toEqual(120020))
})
