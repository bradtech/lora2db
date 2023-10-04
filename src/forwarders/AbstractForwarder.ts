import { ProcessingMessage } from '../ProcessingMessage'

export class AbstractForwarder {
   _config: any = {}
   constructor(config: any) {
      this._config = config
   }

   forward(_message: ProcessingMessage) {}
}
