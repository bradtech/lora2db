import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertSoilHumidity', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`Zero expected to be null`, () =>
      expect(decoder.convertSoilHumidity(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertSoilHumidity(255, 'b00s00')).toEqual(0))

   test(`middle value`, () =>
      expect(decoder.convertSoilHumidity(128, 'b00s00')).toEqual(50))

   test(`maximum value`, () =>
      expect(decoder.convertSoilHumidity(1, 'b00s00')).toEqual(100))
})
