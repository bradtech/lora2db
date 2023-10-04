import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[1]

describe('Decoding fractionned payload port5 air data', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p5)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain a 'pressure' object and 'pressure=403' field `, () => {
      expect(payload).toHaveProperty('pressure')
      expect(payload.pressure).toHaveProperty('pressure')
      expect(payload.pressure.pressure).toEqual(403)
   })

   test(`should contain a 'temperature' object with an 'air=33.5' field`, () => {
      expect(payload).toHaveProperty('temperature')
      expect(payload.temperature).toHaveProperty('air')
      expect(payload.temperature.air).toEqual(33.5)
   })

   test(`should contain a 'humidity' object with an 'air=40' field`, () => {
      expect(payload).toHaveProperty('humidity')
      expect(payload.humidity).toHaveProperty('air')
      expect(payload.humidity.air).toEqual(40)
   })
})
