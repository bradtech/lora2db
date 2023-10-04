import { expect, describe, test } from 'bun:test'
import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[2]

describe('Decoding fractionned payload port6 light data', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p6)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain a 'luminosity' object with field 'luminosity=950'`, () => {
      expect(payload).toHaveProperty('luminosity')
      expect(payload.luminosity).toHaveProperty('luminosity')
      expect(payload.luminosity.luminosity).toEqual(950)
   })

   test(`should contain a 'ultraviolet' object with field 'uv=0'`, () => {
      expect(payload).toHaveProperty('ultraviolet')
      expect(payload.ultraviolet).toHaveProperty('uv')
      expect(payload.ultraviolet.uv).toEqual(0)
   })
})
