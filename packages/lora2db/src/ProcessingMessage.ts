export class ProcessingMessage {
   private _payload: any = undefined
   private _data: any = undefined
   private _meta: any = undefined
   private _net: any = undefined
   private _timestamp: any = undefined
   private _warnings: string[] = []

   constructor(
      payload: any = null,
      data: any = {},
      meta: any = {},
      net: any = undefined,
      timestamp: number = Date.now(),
      warnings: string[] = [],
   ) {
      this._payload = payload
      this._data = data
      this._meta = meta
      this._net = net
      this._timestamp = timestamp
      this._warnings = warnings
   }

   set data(data: any) {
      this._data = data
   }

   get data() {
      return this._data
   }

   set meta(meta: any) {
      this._meta = meta
   }

   get meta() {
      return this._meta
   }

   set net(net: any) {
      this._net = net
   }

   get net() {
      return this._net
   }

   set timestamp(timestamp: number) {
      this._timestamp = timestamp
   }

   get timestamp() {
      return this._timestamp
   }

   set payload(payload: any) {
      this._payload = payload
   }

   get payload() {
      return this._payload
   }

   set warnings(warnings: string[]) {
      this._warnings = warnings
   }

   get warnings() {
      return this._warnings
   }
}
