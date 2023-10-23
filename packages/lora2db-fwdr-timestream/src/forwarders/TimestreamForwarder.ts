import { AbstractForwarder, ProcessingMessage } from '@bradtech/lora2db'
import {
   TimestreamWriteClient,
   WriteRecordsCommand,
} from '@aws-sdk/client-timestream-write'

export class TimestreamForwarder extends AbstractForwarder {
   _server: any
   _writer: any
   constructor(config: any) {
      super(config)
      this._server = new TimestreamWriteClient({
         region: this._config.TIMESTREAM_REGION,
         credentials: {
            accessKeyId: this._config.TIMESTREAM_ACCESS_KEY_ID,
            secretAccessKey: this._config.TIMESTREAM_SECRET_ACCESS_KEY,
         },
      })
   }

   forward(_message: ProcessingMessage) {
      const Dimensions: Array<any> = []
      Object.keys(_message.meta).forEach((tag: string) => {
         Dimensions.push({ Name: tag, Value: _message.meta[tag] })
      })

      const databaseRecords = []

      // walk through all measurements
      for (const measurement of Object.keys(_message.data)) {
         if (Object.keys(_message.data[measurement]).length > 0) {
            let tableRecords: { table: string; records: Array<any> } = {
               table: measurement,
               records: [],
            }
            Object.keys(_message.data[measurement]).forEach((element: any) => {
               tableRecords.records.push({
                  Dimensions,
                  MeasureName: element,
                  MeasureValue: _message.data[measurement][element],
                  MeasureValueType: 'DOUBLE',
                  Time: Date.now(),
               })
            })

            databaseRecords.push(tableRecords)
         } else {
            console.warn(
               `No data to save in '${measurement}': ${JSON.stringify(
                  _message.data[measurement],
               )}`,
            )
         }
      }

      // filter and save net data as well
      const networkRecords: Array<any> = []
      Object.keys(_message.net).forEach((key: string) => {
         networkRecords.push({
            Dimensions,
            MeasureName: key,
            MeasureValue: _message.net[key],
            MeasureValueType: 'DOUBLE',
            Time: Date.now(),
         })
      })
      databaseRecords.push({
         table: _message.meta.network,
         records: networkRecords,
      })

      //save all the records
      databaseRecords.forEach((tableRecords: any) => {
         const params = new WriteRecordsCommand({
            DatabaseName: this._config.TIMESTREAM_DB_NAME,
            TableName: tableRecords.table,
            Records: tableRecords.records,
         })

         this._server.send(params).then(
            (data: any) => {
               console.log(data)
            },
            (err: any) => {
               console.error(err)
            },
         )
      })
   }
}