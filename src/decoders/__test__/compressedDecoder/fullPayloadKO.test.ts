import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Decoding non functional compressed payload', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p1_KO)

   test(`should contain 9 i2c warnings`, () => {
      expect(decoder).toHaveProperty('warnings')
      expect(decoder.warnings).toHaveLength(10)
   })

   test(`shouldn't contain a 'temperature' object`, () => {
      expect(payload).not.toHaveProperty('temperature')
   })

   test(`shouldn't contain a 'humidity' object`, () => {
      expect(payload).not.toHaveProperty('humidity')
   })

   test(`shouldn't contain a 'luminosity' object`, () => {
      expect(payload).not.toHaveProperty('luminosity')
   })

   test(`shouldn't contain a 'pressure' object`, () => {
      expect(payload).not.toHaveProperty('pressure')
   })

   test(`should contain a 'voltage' object with field 'voltage=4.02'`, () => {
      expect(payload).toHaveProperty('voltage')
      expect(payload.voltage).toHaveProperty('voltage')
      expect(payload.voltage.voltage).toEqual(4.02)
   })
})
