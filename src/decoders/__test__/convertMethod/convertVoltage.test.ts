import { CompressedDecoder } from '../../CompressedDecoder'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Function convertVoltage', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   test(`Zero expected to be null`, () =>
      expect(decoder.convertVoltage(0, 'b00s00')).toEqual(null))

   test(`Minimum value`, () =>
      expect(decoder.convertVoltage(1, 'b00s00')).toEqual(1.67))

   test(`middle value`, () =>
      expect(decoder.convertVoltage(127, 'b00s00')).toEqual(2.93))

   test(`maximum value`, () =>
      expect(decoder.convertVoltage(255, 'b00s00')).toEqual(4.21))
})
