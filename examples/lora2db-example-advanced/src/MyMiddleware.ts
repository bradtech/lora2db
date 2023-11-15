import { AbstractMiddleware, ProcessingMessage } from '@bradtech/lora2db'

export class MyMiddleware extends AbstractMiddleware {
   /**
    * This method is called by the program to allow transformation
    * of the message received and its data
    * @param _message
    */
   async execute(_message: ProcessingMessage) {
      // do something with data in ProcessingMessage instance
   }
}
