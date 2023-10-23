import { AbstractAdapter } from '.'

/**
 * @see https://liveobjects.orange-business.com/doc/html/lo_manual.html#_lora_output
 *
 */
export class OrangeAdapter extends AbstractAdapter {
   getDeviceId = () => this._jsonMessage.streamId.split(':').pop()

   getBuffer = (): Buffer => Buffer.from(this._jsonMessage.value.payload, 'hex')

   getPort = () => this._jsonMessage.metadata.network.lora.port

   getNetData = () => {
      if (
         this._jsonMessage.metadata.network &&
         this._jsonMessage.metadata.network.lora
      ) {
         const {
            rssi,
            snr,
            esp,
            frequency,
            signalLevel,
            gatewayCnt,
            fcnt,
            port,
            sf,
         } = this._jsonMessage.metadata.network.lora

         return {
            rssi,
            snr,
            esp,
            frequency,
            signalLevel,
            gatewayCnt,
            fcnt,
            port,
            sf,
         }
      } else {
         return {}
      }
   }
}

/**
b20s039 {
   source: 'urn:lo:nsid:lora:b20s039',
   group: { id: '1cfUKs', path: '/DEV_FR' },
   connector: 'lora',
   network: {
      lora: {
         devEUI: '8C1F6454902FFF9F',
         port: 2,
         fcnt: 419,
         missingFcnt: 0,
         rssi: -105,
         snr: 6.5,
         esp: -105.88,
         sf: 9,
         frequency: 868.1,
         signalLevel: 5,
         ack: false,
         messageType: 'CONFIRMED_DATA_UP',
         location: [Object],
         gatewayCnt: 3
      }
   }
}
*/
