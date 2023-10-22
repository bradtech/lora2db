import { ProcessingMessage } from '../ProcessingMessage'

/**
 * This is the abstract of a middleware class
 * The only required method is execute() that would receive the ProcessingMessage
 * and add, delete or transform data in it
 */
export abstract class AbstractMiddleware {
   _config:any = {}
   constructor(config: any = {}) {
      this._config = config
   }

   /**
    * This method is called by the program to allow transformation
    * of the message received and its data
    * @param _message
    */
   async execute(_message: ProcessingMessage) {
      // do something with data
   }
}
