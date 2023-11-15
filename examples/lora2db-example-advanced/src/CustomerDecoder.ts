import { AbstractDecoder } from '@bradtech/lora2db'

export class CustomDecoder extends AbstractDecoder {
   decode(payload: any, metadata: any): any {
      /**
       * process provider payload here
       */

      return {}
   }
}
