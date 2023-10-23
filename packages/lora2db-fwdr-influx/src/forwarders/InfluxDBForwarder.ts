import { AbstractForwarder, ProcessingMessage } from '@bradtech/lora2db'
const { InfluxDB, Point } = require('@influxdata/influxdb-client')

export class InfluxDBForwarder extends AbstractForwarder {
   _server: any
   _writer: any
   constructor(config: any) {
      super(config)
      this._server = new InfluxDB({
         url: this._config.INFLUX_HOST,
         token: this._config.INFLUX_TOKEN,
      })
   }

   forward(_message: ProcessingMessage) {
      this._writer = this._server.getWriteApi(
         this._config.INFLUX_ORG,
         this._config.INFLUX_BUCKET,
      )

      const defaultTags = _message.meta

      this._writer.useDefaultTags(defaultTags)

      const points = []

      // walk through all measurements
      for (const measurement of Object.keys(_message.data)) {
         // if data exists, push it to points
         if (Object.keys(_message.data[measurement]).length > 0) {
            const point = new Point(measurement)
            point.fields = _message.data[measurement]
            points.push(point)
         } else {
            console.warn(
               `No data to save in '${measurement}': ${JSON.stringify(
                  _message.data[measurement],
               )}`,
            )
         }
      }

      // filter and save net data as well
      const point = new Point(_message.meta.network)
      Object.keys(_message.net).forEach((key: string) => {
         const data = _message.net[key]
         if (!isNaN(data)) {
            point.fields[key] = data
         }
      })
      points.push(point)

      console.debug(defaultTags, points)
      if (Object.keys(points).length > 0) {
         this._writer.writePoints(points)
      } else {
         console.log(`No data to save in Influx database!`)
      }

      this._writer
         .close()
         .then(() =>
            console.log(
               `Data successfully sent to influx host '${this._config.INFLUX_HOST}' and bucket '${this._config.INFLUX_BUCKET}'`,
            ),
         )
         .catch((err: Error) => {
            console.error(
               `Error saving data to InfluxDB host '${this._config.INFLUX_HOST}' ! ${err.stack}`,
            ),
               console.log(this._writer)
         })
   }
}
