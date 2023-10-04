import { AbstractDecoder } from './AbstractDecoder'
import { LPPDecoder } from '../decoder'

export class CayenneDecoder extends AbstractDecoder {
   async decode(payload: any, metadata: any) {
      this._payload = payload
      this._metadata = metadata

      const decoder = new LPPDecoder(this._payload)
      decoder.decode(payload)

      let config = null

      const meta = decoder.getChannel(0)

      // console.log('data', decoder.getChannels())

      // get payload format version
      switch (meta.digital) {
         case 3:
            config = this._config.measurements.influx.v3
            break
         case 2:
            config = this._config.measurements.influx.v2
            break
         default:
            config = this._config.measurements.influx.v1
            break
      }

      // convert payload to ordered object
      const data: any = {}
      for (const measurement of Object.keys(config)) {
         const configPart: any = config[measurement]
         const fields: any = {}
         for (const channel of Object.keys(configPart.channels)) {
            let value = decoder.getChannelData(
               channel,
               configPart.key || measurement,
            )
            if (value) {
               if (typeof configPart.processor === 'function') {
                  value = configPart.processor(value)
               }
               fields[configPart.channels[channel]] = value
            }
         }

         data[measurement] = fields
      }

      return data
   }
   catch(e: Error) {
      console.error(e)
      return false
   }
}
