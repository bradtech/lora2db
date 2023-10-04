import { expect, describe, test } from 'bun:test'
import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[6]

describe('Decoding fractionned payload port11 foot 1 & 2 data', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p11)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain a 'humidity' object with field 'soil1=39' and 'soil2=5'`, () => {
      expect(payload).toHaveProperty('humidity')
      expect(payload.humidity).toHaveProperty('soil1')
      expect(payload.humidity.soil1).toEqual(39)
      expect(payload.humidity).toHaveProperty('soil2')
      expect(payload.humidity.soil2).toEqual(5)
   })

   test(`should contain a 'temperature' object with field 'soil1=24.5' and 'soil2=22.75'`, () => {
      expect(payload).toHaveProperty('temperature')
      expect(payload.temperature).toHaveProperty('soil1')
      expect(payload.temperature.soil1).toEqual(24.5)
      expect(payload.temperature).toHaveProperty('soil2')
      expect(payload.temperature.soil2).toEqual(22.75)
   })
})
