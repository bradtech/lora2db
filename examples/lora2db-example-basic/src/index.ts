import { MQTTClient, CayenneDecoder, AbstractProvider } from '@bradtech/lora2db'
import { TTNProvider } from '@bradtech/lora2db-provider-ttn'
import { InfluxDBForwarder } from '@bradtech/lora2db-fwdr-influx'
import { env, exit } from 'process'
import { measurements } from './config/measurement'

try {
   if (env.NODE_ENV !== 'production') {
      const path = require('path')
      // we only use env files in develop and staging mode
      // in production, the container running the code is already populated
      // with the right values
      require('dotenv').config({
         path: path.join(path.dirname(__dirname), `.env.${env.NODE_ENV}`),
      })
   }

   AbstractProvider.registerAdapter(TTNProvider, 'ttn')

   const { LORA_MQTT_URL, LORA_MQTT_USERNAME, LORA_MQTT_TOPIC, LORA_API_KEY } =
      env

   const client = new MQTTClient({
      url: LORA_MQTT_URL,
      username: LORA_MQTT_USERNAME,
      password: LORA_API_KEY,
      topic: LORA_MQTT_TOPIC,
      provider: 'ttn',
   })

   // decoders transform lora payload to comprehensible data
   // each decoder is bound to a port and is triggered if received
   // message is on this port

   // inject your port-based decoders here
   client.addDecoder(new CayenneDecoder({ measurements }), 1) // port 2

   // inject your forwarders here
   // forwarders receive data and send it to a destination, generally a server

   // Add InfluxDB Forwarder
   client.addForwarder(
      new InfluxDBForwarder({
         INFLUX_HOST: env.INFLUX_HOST,
         INFLUX_TOKEN: env.INFLUX_TOKEN,
         INFLUX_ORG: env.INFLUX_ORG,
         INFLUX_BUCKET: env.INFLUX_BUCKET,
      }),
   )

   // Start to listen to queue
   client.listen()
} catch (e) {
   console.error(`ERROR: ${(e as Error).message}`)
   exit(1)
}
