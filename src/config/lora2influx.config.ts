import { CayenneDecoder } from '../decoders/CayenneDecoder'
import { CompressedDecoder } from '../decoders/CompressedDecoder'
import { InfluxDBForwarder } from '../forwarders/InfluxDBForwarder'
import { measurements } from './measurement'

const {
   LORA_PROVIDER,
   LORA_MQTT_URL,
   LORA_MQTT_USERNAME,
   LORA_MQTT_TOPIC,
   LORA_API_KEY,
} = process.env

export default {
   clientConfig: {
      url: LORA_MQTT_URL,
      username: LORA_MQTT_USERNAME,
      password: LORA_API_KEY,
      topic: LORA_MQTT_TOPIC,
      provider: LORA_PROVIDER,
   },
   decoders: [
      CayenneDecoder.prototype,
      { measurements },
      1,
      new CayenneDecoder(measurements, 1),
      new CayenneDecoder(measurements, 2),
      new CompressedDecoder(
         {
            format: [
               'i2c',
               'voltage',
               'humidity:soil1',
               'temperature:soil1',
               'humidity:soil2',
               'temperature:soil2',
               'luminosity',
               'uvIndex',
               'pressure:air',
               'humidity:air',
               'temperature:air',
            ],
         },
         10,
      ),
   ],
   middlewares: [
      /* new MyMiddleware(process.env) */
   ],
   forwarders: [new InfluxDBForwarder(process.env)],
}
