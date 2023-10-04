export const measurements = {
   influx: {
      v1: {
         temperature: {
            channels: { 1: 'air', 2: 'soil1', 3: 'soil2' },
         },
         humidity: {
            channels: { 1: 'air', 2: 'soil1', 3: 'soil2' },
         },
         voltage: {
            key: 'analog',
            channels: { 0: 'voltage' },
         },
         luminosity: {
            channels: { 1: 'luminosity' },
         },
         ultraviolet: {
            key: 'digital',
            channels: { 1: 'uv' },
         },
      },
      v2: {
         temperature: {
            channels: { 0: 'air', 2: 'soil1', 3: 'soil2' },
         },
         humidity: {
            channels: { 0: 'air', 2: 'soil1', 3: 'soil2' },
         },
         voltage: {
            key: 'analog',
            channels: { 0: 'voltage' },
         },
         luminosity: {
            channels: { 1: 'luminosity' },
         },
         ultraviolet: {
            key: 'digital',
            channels: { 1: 'uv' },
         },
      },
      v3: {
         temperature: {
            channels: { 2: 'soil1', 3: 'soil2', 4: 'air' },
         },
         humidity: {
            channels: { 2: 'soil1', 3: 'soil2', 4: 'air' },
         },
         voltage: {
            key: 'analog',
            channels: { 0: 'voltage' },
         },
         luminosity: {
            channels: { 1: 'luminosity' },
         },
         ultraviolet: {
            key: 'digital',
            channels: { 1: 'uv' },
            // value <= 16 is already a percent
            // value above is a raw measure
            processor: (val: number) =>
               val > 16 ? Math.round(val / 100) : val,
         },
         pressure: { key: 'barometric_pressure', channels: { 4: 'pressure' } },
      },
   },
}
