import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[7]

describe('Decoding fractionned payload port12 light data V2', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p12)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain a 'luminosity' object with field 'luminosity=837'`, () => {
      expect(payload).toHaveProperty('luminosity')
      expect(payload.luminosity).toHaveProperty('luminosity')
      expect(payload.luminosity.luminosity).toEqual(837)
   })

   test(`should contain a 'ultraviolet' object with field 'ultraviolet=0'`, () => {
      expect(payload).toHaveProperty('ultraviolet')
      expect(payload.ultraviolet).toHaveProperty('ultraviolet')
      expect(payload.ultraviolet.ultraviolet).toEqual(0)
   })
})
