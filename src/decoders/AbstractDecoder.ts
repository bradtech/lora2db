export class AbstractDecoder {
   protected _port = 0
   protected _name = ''
   protected _payload = {}
   _metadata = {}
   _config: { [x: string]: any } = {}
   _warnings: string[] = []

   static TEMPERATURE = 'temperature'
   static HUMIDITY = 'humidity'
   static PRESSURE = 'pressure'
   static LUMINOSITY = 'luminosity'
   static ULTRAVIOLET = 'ultraviolet'
   static VOLTAGE = 'voltage'
   static I2C = 'i2c'

   constructor(config: any = {}, port: number | undefined = undefined) {
      this._config = config
      if (port) {
         this.port = config.port
      }
      if (config.name) {
         this._name = config.name
      }
   }

   getPort = () => this._port

   get port() {
      return this._port
   }

   get name() {
      return this._name
   }

   set port(port: number) {
      this._port = port
   }

   get warnings() {
      return this._warnings
   }

   addWarning(message: string, context: any = '') {
      this._warnings.push(`[${context}] ${message}`)
   }

   decode(payload: any, metadata: any): any {
      this._payload = payload
      this._metadata = metadata

      return {}
   }

   static remap = (
      x: number,
      in_min: number,
      in_max: number,
      out_min: number,
      out_max: number,
   ) => {
      const divisor = in_max - in_min
      if (divisor === 0) {
         throw new Error(`Error min and max values shouldn't be the same!`)
      }
      return ((x - in_min) * (out_max - out_min)) / divisor + out_min
   }
}

