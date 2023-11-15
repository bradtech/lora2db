# lora2db

[![Test, build and publish module CI](https://github.com/bradtech/lora2db/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/bradtech/lora2db/actions/workflows/build.yml)

## Description

Lora2db is a Typescript packages stack that helps you manage Lorawan message queues, manipulate data and push it to time series databases. It's a project that is used on a daily basis here at Brad Technology.

## Get started

First, install the `@bradtech/lora2db` module with your favorite package manager

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

### Providers

A provider will listen for data coming in, and a forwarder will send your processed data to the DBMS or service of your choice.

Providers classes need to be declared before starting the client. We are now supporting only MQTT-based providers. This may change in the future.

```ts
import { TTNProvider } from '@bradtech/lora2db-provider-ttn'

AbstractProvider.registerAdapter(TTNProvider, 'ttn')
```

#### Decoders

You must declare at least one decoder to process the payload coming from your provider.

We provide the `CayenneDecoder` class but you can write your own by extending the `AbstractDecoder` class.

```ts
client.addDecoder(new CayenneDecoder(/* config map */), port)
```

You may declare as many decoders as you want, each being bound to an unique Lorawan port.

We use a specific decoder that allows us to improve payload compression and reduce data loss. We plan to publish it in the near future. Feel free to contact us about it.

### Middlewares

Middlewares are classes that receive data in the form of a `ProcessingMessage` instance. They are able to manipulate and enrich it. This can be done with internal functions but also by calling external APIS for example.

```ts
client.addMiddleware(/* config map */)
```

You can chain as many middlewares as you want. They are called one after the other, with respect of their order of injection. 

## How to use

Example using Bun.

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
