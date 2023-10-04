import { CompressedDecoder } from '../../CompressedDecoder'
import * as buffers from '../fixtures/compressed-payload'
import configs from '../fixtures/compressed-decoders'

const config = configs[0]

describe('Decoding fractionned payload port3 heartbeatMessage', () => {
   const decoder = new CompressedDecoder({
      format: config.format,
      name: config.name,
   })

   const payload = decoder.decode(buffers.p3)

   test(`should be an object`, () => expect(payload).toBeInstanceOf(Object))

   test(`should contain a 'voltage' object with field 'voltage=4.12'`, () => {
      expect(payload).toHaveProperty('voltage')
      expect(payload.voltage).toHaveProperty('voltage')
      expect(payload.voltage.voltage).toEqual(4.12)
   })
})
