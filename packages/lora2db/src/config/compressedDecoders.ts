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
      name: 'soil1Config',
      format: ['humidity:soil1', 'temperature:soil1'],
      port: 7,
   },

   {
      // @DEPRECATED lookis like ORange is filtering it
      name: 'soil2Config',
      format: ['humidity:soil2', 'temperature:soil2'],
      port: 8,
   },
   {
      name: 'soil3Config',
      format: ['humidity:soil3', 'temperature:soil3'],
      port: 9,
   },
   {
      name: 'soil4Config',
      format: ['humidity:soil4', 'temperature:soil4'],
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
   {
      name: 'lightConfigv3',
      format: ['luminosity:lux:2'],
      port: 13,
   },
   {
      name: 'lightConfigv3',
      format: ['luminosity:lux:2', 'ultraviolet:uv'],
      port: 14,
   },
   {
      name: 'soilRightConfig',
      format: ['humidity:soil2', 'temperature:soil2'],
      port: 15,
   },
   {
      name: 'warning',
      format: ['i2c:code'],
      port: 91,
   },
]
