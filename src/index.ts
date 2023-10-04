import { CayenneDecoder } from './decoders/CayenneDecoder'
import { measurements } from './config'
import { InfluxDBForwarder } from './forwarders/InfluxDBForwarder'
import { MQTTClient } from './client/MQTTClient'
import { CompressedDecoder } from './decoders/CompressedDecoder'
import { env, exit } from 'process'

// list of different compressed payload configurations
import cdc from './config/compressedDecoders'

try {
   console.log(`Starting service version ${require('../package.json').version}`)

   if (env.NODE_ENV !== 'production') {
      const path = require('path')
      // we only use env files in develop and staging mode
      // in production, the container running the code is already populated
      // with the right values (from deployment manifests)
      require('dotenv').config({
         path: path.join(path.dirname(__dirname), `.env.${env.NODE_ENV}`),
      })
   }

   const {
      LORA_PROVIDER,
      LORA_MQTT_URL,
      LORA_MQTT_USERNAME,
      LORA_MQTT_TOPIC,
      LORA_API_KEY,
   } = env

   if (!LORA_PROVIDER) {
      console.error(`Missing configuration parameters`)
      exit(1)
   }

   const client = new MQTTClient({
      url: LORA_MQTT_URL,
      username: LORA_MQTT_USERNAME,
      password: LORA_API_KEY,
      topic: LORA_MQTT_TOPIC,
      provider: LORA_PROVIDER,
   })

   // decoders transform lora payload to comprehensible data
   //.each decoder is bound to a port and is triggered if received
   // message is on this port

   // inject your port-based decoders here
   client.addDecoder(new CayenneDecoder({ measurements }), 2) // port 2

   for (const config of cdc) {
      console.log(`Adding ${config.name} configuration of Compressed decoder`)
      client.addDecoder(
         new CompressedDecoder({ format: config.format, name: config.name }),
         config.port,
      )
   }
   // inject your optional chain of middlewares here
   // they may transform data or enrich metadata
   // client.addMiddleware(new MyMiddleware(env))

   // inject your forwarders here
   // forwarders receive data and send it to a destination, generally a server

   // Add InfluxDB v3 Forwarder
   client.addForwarder(
      new InfluxDBForwarder({
         INFLUX_HOST: env.INFLUX3_HOST,
         INFLUX_TOKEN: env.INFLUX3_TOKEN,
         INFLUX_ORG: env.INFLUX3_ORG,
         INFLUX_BUCKET: env.INFLUX3_BUCKET,
      }),
   )

   // Start to listen to queue
   client.listen()
} catch (e) {
   console.log(e)
   console.error(`ERROR: ${(e as Error).message}`)
   exit(1)
}
