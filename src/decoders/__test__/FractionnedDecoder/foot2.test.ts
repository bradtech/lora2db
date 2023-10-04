import { expect, describe, test } from 'bun:test'
import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[4]

describe('Decoding fractionned payload port8 foot 2 data', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p8)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain a 'humidity' object with field 'soil2=5'`, () => {
      expect(payload).toHaveProperty('humidity')
      expect(payload.humidity).toHaveProperty('soil2')
      expect(payload.humidity.soil2).toEqual(5)
   })

   test(`should contain a 'temperature' object with field 'soil2=22.75'`, () => {
      expect(payload).toHaveProperty('temperature')
      expect(payload.temperature).toHaveProperty('soil2')
      expect(payload.temperature.soil2).toEqual(22.75)
   })
})
