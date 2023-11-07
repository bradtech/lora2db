# lora2db

[![Test, build and publish module CI](https://github.com/bradtech/lora2db/actions/workflows/build.yml/badge.svg)](https://github.com/bradtech/lora2db/actions/workflows/build.yml)

## Description

A Typescript package to manage Lorawan message queues and push data to time series databases

## Get started

First, you'll need to download the `@bradtech/lora2db` module with your favorite package manager

```sh
npm i @bradtech/lora2db
# OR
bun add @bradtech/lora2db
```

... and then download a provider and a forwarder that suit your needs, among:

```bash
# Providers
@bradtech/lora2db-provider-ttn
@bradtech/lora2db-provider-orange

# Forwarders
@bradtech/lora2db-fwdr-influx
@bradtech/lora2db-fwdr-timestream
```

These packages will manage I/O in your stead, so that you can focus on your business logic and deploy quickly.

A provider will listen for data coming in, and a forwarder will send your processed data to the DBMS or service of your choice.

## How to use

```ts
import {
   MQTTClient,
   CayenneDecoder,
   AbstractProvider,
   CompressedDecoder,
} from '@bradtech/lora2db'
import { TTNProvider } from '@bradtech/lora2db-provider-ttn'
import { OrangeProvider } from '@bradtech/lora2db-provider-orange'
import { InfluxDBForwarder } from '@bradtech/lora2db-fwdr-influx'

// First, you'll need to register your providers
AbstractProvider.registerAdapter(TTNProvider, 'ttn')
AbstractProvider.registerAdapter(OrangeProvider, 'orange')

const {
    LORA_PROVIDER,
    LORA_MQTT_URL,
    LORA_MQTT_USERNAME,
    LORA_MQTT_TOPIC,
    LORA_API_KEY,
} = Bun.env

const port = 2

// Then, you'll have to instantiate a client...
const client = new MQTTClient({
    url: LORA_MQTT_URL,
    username: LORA_MQTT_USERNAME,
    password: LORA_API_KEY,
    topic: LORA_MQTT_TOPIC,
    provider: LORA_PROVIDER,
})

// ... and inject your port-based decoders into it
client.addDecoder(new CayenneDecoder({ ... }), port)

// You can also inject middlewares to do some processing before forwarding the data
client.addMiddleware(...)

// Inject your forwarder
client.addForwarder(
    new InfluxDBForwarder({
        INFLUX_HOST: Bun.env.INFLUX_HOST,
        INFLUX_TOKEN: Bun.env.INFLUX_TOKEN,
        INFLUX_ORG: Bun.env.INFLUX_ORG,
        INFLUX_BUCKET: Bun.env.INFLUX_BUCKET,
    }),
)

// And finally, listen to queue
client.listen()
```
