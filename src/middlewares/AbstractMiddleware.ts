import { ProcessingMessage } from '../ProcessingMessage'

export abstract class AbstractMiddleware {
   _config:any = {}
   constructor(config: any = {}) {
      this._config = config
   }

   async execute(_message: ProcessingMessage) {
      // do something with data
   }
}
