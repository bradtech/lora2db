export class AbstractProvider {
   _payload = {}
   _data = {}
   _jsonMessage: any = null
   static classMap = {}

   constructor(payload = undefined) {
      if (payload !== undefined) {
         this.payload(payload)
      }
   }

   payload(payload: any = {}) {
      this._payload = payload
      this._jsonMessage = JSON.parse(payload)
   }

   static registerAdapter(adapter: any, provider: string) {
      Reflect.set(AbstractProvider.classMap, provider, adapter)
   }

   static factory(loraProvider: string) {
      try {
         const adapterClass = Reflect.get(
            AbstractProvider.classMap,
            loraProvider,
         )
         return new adapterClass()
      } catch (e) {
         console.log(e)
         throw new Error(
            `Unable to instanciate class for provider ${loraProvider}`,
         )
      }
   }

   getDeviceId = () => ''

   getBuffer = (): Buffer => Buffer.from('')

   getPort = () => 1

   getNetData = () => {}

   calcEsp = (rssi: number, snr: number) =>
      parseFloat((rssi - 10 * Math.log(1 + 10 * --snr)).toFixed(1))

   isMessage = () => true

   getMessage = () => this._jsonMessage
}
