const https = require('https')

export const sendSlackMessage = (webhookURL: string, message: any) => {
   try {
      message = JSON.stringify(message)
   } catch (e) {
      throw new Error(e as any)
   }

   return new Promise((resolve, reject) => {
      const requestOptions = {
         method: 'POST',
         header: {
            'Content-Type': 'application/json',
         },
      }

      const req = https.request(webhookURL, requestOptions, (res: any) => {
         let response = ''

         res.on('data', (d: any) => {
            response += d
         })

         // response finished, resolve the promise with data
         res.on('end', () => {
            resolve(response)
         })
      })

      // there was an error, reject the promise
      req.on('error', (e: any) => {
         reject(e)
      })

      // send our message body (was parsed to JSON beforehand)
      req.write(message)
      req.end()
   })
}
