import { AbstractDecoder } from './AbstractDecoder'

export class CompressedDecoder extends AbstractDecoder {
   static BME_HUMIDITY = 'BME280: Error while reading air humidity'
   static BME_TEMPERATURE = 'BME280: Error while reading air temperature'
   static BME_PRESSURE = `BME280: Error while reading pressure`
   static SI1145_LIGHT = 'SI1145: Error while reading visible light'
   static SI1145_UV = 'SI1145: Error while reading UV light'
   static ADS1X15_HUMIDITY = 'ADS1X15: Error while reading soil humidity'
   static ADS1X15_TEMPERATURE = 'ADS1X15: Error while reading soil temperature'
   static I2C_SCL1 = 'I2C Error: Could not clear SCL clock line held low'
   static I2C_SCL2 =
      'I2C Error: Could not clear SCL clock line held low by slave clock stretch for >2sec'
   static I2C_SDA1 = 'I2C Error: Could not clear. SDA data line held low'
   static I2C_IEC = 'I2C Error: Invalid error code'
   static VOLTAGE_ERR = `Voltage: Unable to convert value`

   remap = (
      x: number,
      in_min: number,
      in_max: number,
      out_min: number,
      out_max: number,
   ) => {
      const divisor = in_max - in_min
      if (divisor === 0) {
         this.addWarning(`Error min and max values shouldn't be the same!`)
      }
      return ((x - in_min) * (out_max - out_min)) / divisor + out_min
   }

   /**
    * Convert humidity raw value to percent
    * @param compressedVal number
    * @returns number
    */
   convertAirHumidity(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return Math.round(compressedVal * (100 / 255))
      } else {
         this.addWarning(CompressedDecoder.BME_HUMIDITY, sensor)
         return null
      }
   }

   convertSoilHumidity(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return Math.round(
            100 -
               // value is matching draught level, must be reversed
               this.remap((compressedVal - 1) * 2.75 + 600, 600, 1300, 0, 100),
         )
      } else {
         this.addWarning(CompressedDecoder.ADS1X15_HUMIDITY, sensor)
         return null
      }
   }

   convertAirTemperature(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return -40 + (compressedVal - 1) * 0.5
      } else {
         this.addWarning(CompressedDecoder.BME_TEMPERATURE, sensor)
         return null
      }
   }

   convertSoilTemperature(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return -10 + (compressedVal - 1) * 0.25
      } else {
         this.addWarning(CompressedDecoder.ADS1X15_TEMPERATURE, sensor)
         return null
      }
   }

   convertLuminosity(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         // @deprecated decoder v1 - april 2022
         return (compressedVal - 1) * 472.5 + 5
      } else if (typeof compressedVal === 'object' && compressedVal[1] > 0) {
         // decoder v2 - june 2022
         return (compressedVal[0] << 8) + compressedVal[1]
      } else {
         this.addWarning(CompressedDecoder.SI1145_LIGHT, sensor)
         return null
      }
   }

   convertLux(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'object' && compressedVal[1] > 0) {
         return ((compressedVal[0] << 8) + compressedVal[1]) * 2
      } else {
         this.addWarning(CompressedDecoder.SI1145_LIGHT, sensor)
         return null
      }
   }

   convertUV(compressedVal: number | Uint8Array, sensor: string) {
      // uv value is not compressed, zero is an error!
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return compressedVal - 1
      } else {
         this.addWarning(CompressedDecoder.SI1145_UV, sensor)
         return null
      }
   }

   convertPressure(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return Math.round(compressedVal * 2.7 + 400)
      } else {
         this.addWarning(CompressedDecoder.BME_PRESSURE, sensor)
         return null
      }
   }

   convertVoltage(compressedVal: number | Uint8Array, sensor: string) {
      if (typeof compressedVal === 'number' && compressedVal > 0) {
         return parseFloat((compressedVal * 0.01 + 1.66).toFixed(2))
      } else {
         this.addWarning(CompressedDecoder.VOLTAGE_ERR, sensor)
         return null
      }
   }

   convertI2C(compressedVal: number | Uint8Array) {
      switch (compressedVal) {
         case 0:
            // everything is fine
            break
         case 1:
            this._warnings.push(CompressedDecoder.I2C_SCL1)
            break
         case 2:
            this._warnings.push(CompressedDecoder.I2C_SCL2)
            break
         case 3:
            this._warnings.push(CompressedDecoder.I2C_SDA1)
            break
         default:
            this._warnings.push(CompressedDecoder.I2C_IEC)
      }

      return undefined
   }

   convertOne(type: string, subtype: string, value: number | Uint8Array) {
      switch (type) {
         case CompressedDecoder.I2C:
            return this.convertI2C(value)

         case CompressedDecoder.ULTRAVIOLET:
            return this.convertUV(value, subtype)

         case CompressedDecoder.HUMIDITY:
            return subtype === 'air'
               ? this.convertAirHumidity(value, subtype)
               : this.convertSoilHumidity(value, subtype)

         case CompressedDecoder.TEMPERATURE:
            return subtype === 'air'
               ? this.convertAirTemperature(value, subtype)
               : this.convertSoilTemperature(value, subtype)

         case CompressedDecoder.LUMINOSITY:
            return subtype === 'lux'
               ? this.convertLux(value, subtype)
               : this.convertLuminosity(value, subtype)

         case CompressedDecoder.PRESSURE:
            return this.convertPressure(value, subtype)

         case CompressedDecoder.VOLTAGE:
            return this.convertVoltage(value, subtype)

         default:
            return undefined
      }
   }

   /**
    * Decode payload using format configuration
    * @param payload
    * @returns
    */
   decode(payload: Buffer) {
      this._warnings = []
      const data: any = {}
      const view = new Uint8Array(payload)
      let pointer = 0
      this._config.format.forEach((dataType: string) => {
         const [type, subType, bytes = 1] = dataType.split(':')
         const valueLength = typeof bytes === 'string' ? parseInt(bytes) : bytes
         const value = this.convertOne(
            type,
            subType || type,
            valueLength === 1
               ? view[pointer]
               : view.subarray(pointer, pointer + valueLength),
         )
         if (typeof value === 'number') {
            if (!Reflect.has(data, type)) {
               data[type] = {}
            }
            console.debug(
               dataType,
               `compressed data ${view[pointer]} ==> ${value} at pointer ${pointer}`,
            )
            data[type][subType || type] = value
         }
         pointer += valueLength
      })

      console.log(data, this.warnings)

      return data
   }
}
