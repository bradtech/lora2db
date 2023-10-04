import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[5]

describe('Decoding functional compressed payload', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p1_OK)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain zero i2c warnings`, () => {
      expect(decoder).toHaveProperty('warnings')
      expect(decoder.warnings).toHaveLength(0)
   })

   test(`should contain a 'temperature' object with field 'air=33.5' & 'soil1=24.5' & 'soil2=22.75'`, () => {
      expect(payload).toHaveProperty('temperature')

      expect(payload.temperature).toHaveProperty('air')
      expect(payload.temperature.air).toEqual(33.5)

      expect(payload.temperature).toHaveProperty('soil1')
      expect(payload.temperature.soil1).toEqual(24.5)

      expect(payload.temperature).toHaveProperty('soil2')
      expect(payload.temperature.soil2).toEqual(22.75)
   })

   test(`should contain a 'humidity' object with field 'air=40' & 'soil1=39' & 'soil2=5'`, () => {
      expect(payload).toHaveProperty('humidity')

      expect(payload.humidity).toHaveProperty('air')
      expect(payload.humidity.air).toEqual(40)

      expect(payload.humidity).toHaveProperty('soil1')
      expect(payload.humidity.soil1).toEqual(39)

      expect(payload.humidity).toHaveProperty('soil2')
      expect(payload.humidity.soil2).toEqual(5)
   })

   test(`should contain a 'luminosity' object with field 'luminosity=950'`, () => {
      expect(payload).toHaveProperty('luminosity')
      expect(payload.luminosity).toHaveProperty('luminosity')
      expect(payload.luminosity.luminosity).toEqual(950)
   })

   test(`should contain a 'pressure' object with field 'pressure=403'`, () => {
      expect(payload).toHaveProperty('pressure')
      expect(payload.pressure).toHaveProperty('pressure')
      expect(payload.pressure.pressure).toEqual(403)
   })

   test(`should contain a 'ultraviolet' object with field 'uv=0'`, () => {
      expect(payload).toHaveProperty('ultraviolet')
      expect(payload.ultraviolet).toHaveProperty('uv')
      expect(payload.ultraviolet.uv).toEqual(0)
   })

   test(`should contain a 'voltage' object with field 'voltage=3.54'`, () => {
      expect(payload).toHaveProperty('voltage')
      expect(payload.voltage).toHaveProperty('voltage')
      expect(payload.voltage.voltage).toEqual(3.54)
   })
})
