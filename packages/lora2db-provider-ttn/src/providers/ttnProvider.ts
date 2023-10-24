import { AbstractProvider } from '@bradtech/lora2db'

/**
 * @see https://www.thethingsindustries.com/docs/reference/data-formats/#uplink-messages
 */
export class TTNProvider extends AbstractProvider {
   getDeviceId = () => this._jsonMessage.end_device_ids.device_id

   getBuffer = (): Buffer =>
      Buffer.from(this._jsonMessage.uplink_message.frm_payload, 'base64')

   getPort = () => this._jsonMessage.uplink_message.f_port

   private isPointInTriangle(
      point: Array<number>,
      triangle: Array<Array<number>>,
   ) {
      const [x, y] = point
      const [[x1, y1], [x2, y2], [x3, y3]] = triangle
      const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
      const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator
      const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator
      const c = 1 - a - b
      return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1
   }

   private calculSignalLevel = (snr: number, rssi: number) => {
      // Level 5/5
      if (rssi > -115 && snr > -7) {
         return 5
      }

      // Level 4/5
      if (
         (rssi >= -115 && snr <= -7 && snr >= -15) ||
         (snr >= -7 && rssi >= -126 && rssi <= -115) ||
         this.isPointInTriangle(
            [snr, rssi],
            [
               [-7, -126],
               [-7, -115],
               [-15, -115],
            ],
         )
      ) {
         return 4
      }

      // Level 3/5
      if (
         (rssi < -126 && snr > -15) ||
         this.isPointInTriangle(
            [snr, rssi],
            [
               [-7, -126],
               [-11, -120.5],
               [-15, -126],
            ],
         )
      ) {
         return 3
      }

      // Level 2/5
      if (
         (rssi > -126 && snr < -15) ||
         this.isPointInTriangle(
            [snr, rssi],
            [
               [-15, -126],
               [-15, -115],
               [-11, -120.5],
            ],
         )
      ) {
         return 2
      }

      // Level 1/5
      if (rssi <= -126 && snr <= -15) {
         return 1
      }

      return -1
   }

   getNetData = () => {
      if (
         this._jsonMessage.uplink_message &&
         this._jsonMessage.uplink_message.rx_metadata
      ) {
         const { f_cnt = 0, f_port } = this._jsonMessage.uplink_message
         const { rssi, snr, timestamp } =
            this._jsonMessage.uplink_message.rx_metadata[0]

         const {
            frequency,
            data_rate: {
               lora: { spreading_factor: sf },
            },
         } = this._jsonMessage.uplink_message.settings

         return {
            rssi,
            snr,
            // The "Estimated Signal Power" represents the strength of the useful
            // signal. Basically it can be considered as a measurement of how well
            //a receiver can “hear” a signal from a sender.
            esp: this.calcEsp(rssi, snr),
            frequency: frequency / 1000000,
            signalLevel: this.calculSignalLevel(snr, rssi),
            gatewayCnt: this._jsonMessage.uplink_message.rx_metadata.length,
            sf,
            airtime: parseInt((timestamp / 1000000).toFixed()),
            fcnt: f_cnt,
            port: f_port,
         }
      } else {
         return {}
      }
   }

   isMessage = () => this._jsonMessage.uplink_message
}
