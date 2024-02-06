import { AbstractClient } from './AbstractClient'
import { ProcessingMessage } from '../ProcessingMessage'

const mqtt = require('mqtt')

/**
 * @see TTN: https://www.thethingsindustries.com/docs/integrations/mqtt/
 */
export class MQTTClient extends AbstractClient<any, any, any, any> {
   onMessage = async (_topic: string, message: any) => {
      try {
         this._adapter?.payload(message)

         const device = this._adapter?.getDeviceId()

         const timestamp = this._adapter.getTimestamp()

         console.log(`\n${timestamp} - Received message from sensor ${device}`)

         if (!this._adapter?.isMessage()) {
            console.log(`Ignoring transmission without payload`)
            return false
         }

         const payload = this._adapter.getBuffer()
         // decode payload
         const { warnings, ...data } = await this.decode(payload)

         this._message = new ProcessingMessage(
            payload,
            data,
            {
               device,
               telco: this.provider,
               network: 'lora',
            },
            this._adapter.getNetData(),
            timestamp,
            warnings,
         )

         // execute optional middlewares
         await this.triggerMiddlewares()

         // forward data through forwarders
         await this.forwardData()

         console.log('message', this._message)

         return true
      } catch (e) {
         console.error((e as Error).message)
         return false
      }
   }

   listen = () => {
      super.listen()
      console.log('CTRL + C to quit')

      this.client = mqtt.connect(this.url, {
         username: this.username,
         password: this.password,
         keepAlive: this.keepAlive,
         // avoid TLS error with self-signed certificate
         // @see https://nodejs.org/api/tls.html#tls_tls_connect_options_callback
         rejectUnauthorized: false,
      })

      /** client on connect **/
      this.client.on('connect', () => {
         console.log('MQTT::Connected')

         this.client.subscribe(this.topic, (err: any) => {
            if (err) {
               console.info(
                  `MQTT: FAILED to subscribe to [${this.topic}]: ${err}`,
               ) // check mqtt rate limit
               process.exit(1)
            }
         })
         console.log(`MQTT::Subscribed to topic ${this.topic}`)
      })

      /** client on error **/
      this.client.on('error', (err: any) => {
         console.log('MQTT::Error from client --> ', err)
         process.exit(1)
      })

      this.client.on(
         'message',
         async (topic: string, message: any) =>
            await this.onMessage(topic, message),
      )

      this.client.on('close', () => {
         console.info('MQTT::Connection closed')
         process.exit(0)
      })
   }
}
