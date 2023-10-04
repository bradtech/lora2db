import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertSoilTemperature', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`Zero expected to be null`, () =>
      expect(decoder.convertSoilTemperature(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertSoilTemperature(1, 'b00s00')).toEqual(-10))

   test(`middle value`, () =>
      expect(decoder.convertSoilTemperature(127, 'b00s00')).toEqual(21.5))

   test(`maximum value`, () =>
      expect(decoder.convertSoilTemperature(255, 'b00s00')).toEqual(53.5))
})
