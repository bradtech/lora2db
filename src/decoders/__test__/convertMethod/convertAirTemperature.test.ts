import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertAirTemperature', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`Zero expected to be null`, () =>
      expect(decoder.convertAirTemperature(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertAirTemperature(1, 'b00s00')).toEqual(-40))

   test(`middle value`, () =>
      expect(decoder.convertAirTemperature(127, 'b00s00')).toEqual(23))

   test(`maximum value`, () =>
      expect(decoder.convertAirTemperature(255, 'b00s00')).toEqual(87))
})
