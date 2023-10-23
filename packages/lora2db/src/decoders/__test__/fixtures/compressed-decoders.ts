export default [
   {
      name: 'heartbeatConfig',
      format: ['voltage'],
      port: 3,
   },

   {
      name: 'airConfig',
      format: ['pressure:pressure', 'temperature:air', 'humidity:air'],
      port: 5,
   },
   {
      name: 'lightConfig',
      format: ['luminosity', 'ultraviolet:uv'],
      port: 6,
   },
   {
      name: 'soilLeftConfig',
      format: ['humidity:soil1', 'temperature:soil1'],
      port: 7,
   },

   {
      name: 'soilRightConfig',
      format: ['humidity:soil2', 'temperature:soil2'],
      port: 8,
   },

   {
      name: 'fullConfig',
      format: [
         'i2c',
         'voltage:voltage',
         'humidity:soil1',
         'temperature:soil1',
         'humidity:soil2',
         'temperature:soil2',
         'luminosity',
         'ultraviolet:uv',
         'pressure:pressure',
         'temperature:air',
         'humidity:air',
      ],
      port: 10,
   },

   {
      name: 'soilBothConfig',
      format: [
         'humidity:soil1',
         'temperature:soil1',
         'humidity:soil2',
         'temperature:soil2',
      ],
      port: 11,
   },
   {
      name: 'lightConfigv2',
      format: ['luminosity:luminosity:2', 'ultraviolet'],
      port: 12,
   },
]
