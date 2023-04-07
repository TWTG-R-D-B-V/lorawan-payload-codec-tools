# LoRaWAN Payload Codec Tools

This project contains tools for [TS013-1.0.0 Payload Codec API](https://resources.lora-alliance.org/technical-specifications/ts013-1-0-0-payload-codec-api)

The tools are compliant with the LoRaWan definition, except for these known deviations:

1. In `Table 4` the `fPort` for `encodeDownlink` is `M` (mandatory), while the description adds `if no error occurred`. Therefore we threat `fPort` for `encodeDownlink` as `Ms` (mandatory when successful).
2. In `6.2.1 Payload Examples` the `input.bytes` and `output.bytes` are set as an array of numbers. For readability if the JSON example we define them as a hexadecimal string.

## Project Requirements

- Node 18+
- NPM 8+

## Project setup

You need to pull in some libraries first.

```sh
> npm install
```

## Tools

### Validate examples

This project contains the JSON schema for the examples: [here](./schemas).

To validate all examples (which include bad structures):

```sh
> npm run validate-examples -- examples
```

This will result in the following output:

```sh
ValidationError {
  path: [ 1, 'input', 'bytes' ],
  property: 'instance[1].input.bytes',
  message: 'is not of a type(s) string',
  schema: {
    description: 'the uplink/downlink payload expressed in hexadecimal',
    type: 'string'
  },
  instance: [ 1, 2, 3 ],
  name: 'type',
  argument: [ 'string' ],
  stack: 'instance[1].input.bytes is not of a type(s) string'
}
Failed on file: examples/bad/neon-tt-v4_uplink_no-hex-string.json
```

To validate only the good examples:

```sh
> npm run validate-examples -- examples/good
```

To validate only one bad examples:

```sh
> npm run validate-examples -- examples/bad/neon-tt-v4_encode-error_not-an-array.json
```

### Combine into one examples.json

As per specification all examples need to be packed into one `examples.json` in the root of the codec.
This tool takes all the examples from one folder and places them into one file.

```sh
> npm run export-examples -- examples/good examples.json
```
