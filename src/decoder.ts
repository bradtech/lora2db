const DIGITAL_INPUT = 0x00
const ANALOG_INPUT = 0x02
const LUMINOSITY = 0x65
const TEMPERATURE = 0x67
const HUMIDITY = 0x68
const BAROMETER = 0x73

export class LPPDecoder {
   maxsize: number = 51
   buffer: any = null
   cursor: number = 0
   channels: any = {}
   current: any = null

   constructor(buffer: any) {
      this.maxsize = 51

      if (buffer) {
         this.decode(buffer)
      }
   }

   prepare() {
      this.cursor = 0
      this.channels = {}
      this.current = null // current channel
   }

   /**
    * Try to decode a Cayenne LPP payload in buffer
    */
   decode(buffer: Buffer) {
      if (buffer) {
         this.buffer = buffer
      }
      this.prepare()
      while (this.cursor < this.buffer.length) {
         if (this.current !== null) {
            // channel part is defined
            switch (this.buffer[this.cursor]) {
               case ANALOG_INPUT:
                  this.channels[this.current]['analog'] = this.getAnalogInput()
                  break

               case DIGITAL_INPUT:
                  this.channels[this.current][
                     'digital'
                  ] = this.getDigitalInput()
                  break

               case TEMPERATURE:
                  this.channels[this.current][
                     'temperature'
                  ] = this.getTemperature()
                  break

               case LUMINOSITY:
                  this.channels[this.current][
                     'luminosity'
                  ] = this.getLuminosity()
                  break

               case HUMIDITY:
                  this.channels[this.current][
                     'humidity'
                  ] = this.getRelativeHumidity()
                  break

               case BAROMETER:
                  this.channels[this.current][
                     'barometric_pressure'
                  ] = this.getBarometricPressure()
                  break

               default:
                  console.log(
                     'Unsupported data type: ' + this.buffer[this.cursor],
                  )
                  break
            }
            this.cursor++
            this.current = null
         } else {
            // new channel detection
            this.current = this.buffer[this.cursor++]
            // create the channel if not already declared
            if (!this.channels[this.current]) {
               this.channels[this.current] = {}
               //    console.log(`Declared channel #${this.current}`)
            }
         }
      }
   }

   /**
    * Return all parsed channels
    * @return object
    */
   getChannels() {
      return this.channels
   }

   /**
    * Return the given channel data or false if it doesn't exist
    * @param {integer} key
    * @returns object|boolean
    */
   getChannel(key: any) {
      return this.channels[key] || false
   }

   getChannelData(key: any, data: any) {
      return this.channels[key] ? this.channels[key][data] : undefined
   }

   /**
    * Return a float value and
    * increment the buffer cursor
    * @return float
    */
   getAnalogInput() {
      const value = this.buffer.readInt16BE(++this.cursor)
      this.cursor++

      return value / 100
   }

   /**
    * Return an integer value
    * @return integer
    */
   getDigitalInput() {
      return this.buffer[++this.cursor]
   }

   /**
    * Return a temperature and
    * increment the buffer cursor
    * @return float
    */
   getTemperature() {
      const value = this.buffer.readInt16BE(++this.cursor)
      this.cursor++

      return value / 10
   }

   /**
    * Return a pressure and
    * increment the buffer cursor
    * @return float
    */
   getBarometricPressure() {
      const value = this.buffer.readInt16BE(++this.cursor)
      this.cursor++

      return value / 10
   }

   /**
    * Return a luminosity in Lux and
    * increment the buffer cursor
    * @return integer
    */
   getLuminosity() {
      const value = this.buffer.readUInt16BE(++this.cursor)
      this.cursor++

      return value
   }

   /**
    * Return a relative humidity value in percents and
    * increment the buffer cursor
    * @returns float
    */
   getRelativeHumidity() {
      return this.buffer[++this.cursor] / 2
   }
}
