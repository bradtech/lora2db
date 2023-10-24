import { AbstractProvider } from '../providers/AbstractProvider'
import { AbstractDecoder } from '../decoders/AbstractDecoder'
import { AbstractForwarder } from '../forwarders/AbstractForwarder'
import { AbstractMiddleware } from '../middlewares/AbstractMiddleware'
import { ProcessingMessage } from '../ProcessingMessage'

const timestamp = require('time-stamp')

export class AbstractClient<
   F extends AbstractForwarder,
   M extends AbstractMiddleware,
   A extends AbstractProvider,
   D extends AbstractDecoder,
> {
   url = ''
   username = 'application'
   password = ''
   topic = ''
   keepAlive = 30
   _provider = ''
   client: any
   _adapter: A | undefined = undefined
   _decoders: D[] = []
   _middlewares: M[] = []
   _forwarders: F[] = []
   _message: ProcessingMessage

   constructor(config: any = {}) {
      this.url = config.url
      this.username = config.username
      this.password = config.password
      this.topic = config.topic
      this._provider = config.provider
      this._adapter = AbstractProvider.factory(this._provider)
      this._message = new ProcessingMessage()
      if (config.decoders) {
         this.addDecoders(config.decoders)
      }
   }

   get provider() {
      return this._provider
   }

   timestamp() {
      return timestamp('YYYY-MM-DDTHH:mm:ss.ms')
   }

   addDecoder = (decoder: D, port: number) => {
      decoder.port = port
      this._decoders.push(decoder)
   }

   addDecoders = (decoders: D[]) => {
      decoders.forEach((decoder) => this.addDecoder(decoder, decoder.port))
   }

   addMiddleware = (middleware: M) => this._middlewares.push(middleware)

   addForwarder = (forwarder: F) => this._forwarders.push(forwarder)

   decode = async (message: any) => {
      if (this._decoders.length === 0) {
         throw new Error(`No available decoder`)
      }

      // find decoder matching message port
      const decoder = this._decoders.find(
         (decoder) => decoder.port === this._adapter?.getPort(),
      )

      if (decoder === undefined) {
         throw new Error(`No decoder matching port ${this._adapter?.getPort()}`)
      }

      console.log(
         `Decoding with decoder '${decoder.constructor.name}' and config '${decoder.name}'`,
      )

      return decoder.decode(message, {})
   }

   async triggerMiddlewares() {
      await Promise.all(
         this._middlewares.map(async (middleware) => {
            console.log(`Executing middleware ${middleware.constructor.name}`)
            await middleware.execute(this._message)
         }),
      )
   }

   async forwardData() {
      await Promise.all(
         this._forwarders.map((forwarder) => forwarder.forward(this._message)),
      )
   }

   listen() {
      console.log(
         `${this.timestamp()} - Connecting to ${this.url} with token '${
            this.password
         }'`,
      )
      console.log(`Starting to listen with following configuration`)
      console.log(`* Decoders:`)
      this._decoders.forEach((decoder) =>
         console.log(`  - ${decoder.constructor.name} on port ${decoder.port}`),
      )
      console.log(`* Middlewares:`)
      this._middlewares.forEach((middleware) =>
         console.log(`  - ${middleware.constructor.name}`),
      )
      console.log(`* Forwarders:`)
      this._forwarders.forEach((forwarder) =>
         console.log(`  - ${forwarder.constructor.name}`),
      )
   }
}
