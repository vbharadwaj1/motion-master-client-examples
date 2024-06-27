# Motion Master Client Examples

This repository provides TypeScript/JavaScript examples for interacting with Synapticon's Motion Master server application to configure and control SOMANET devices.

## Building

To transpile from TypeScript to JavaScript, use the following command:

```sh
npm run build
```

The resulting JavaScript files will be located in the `dist/` folder.

## Running

Before executing any scripts, ensure to set the `MOTION_MASTER_HOSTNAME` environment variable. For example, if the Motion Master process runs at `192.168.1.112`, you have two options:

Before executing a script, you must set the `MOTION_MASTER_HOSTNAME` environment variable. Let's say the Motion Master process runs at `192.168.1.112`, there are at least two ways to do it:

1. Create a `.env` file in the repository root with `MOTION_MASTER_HOSTNAME=192.168.1.112`.
2. Run a script directly by setting the variable inline: `MOTION_MASTER_HOSTNAME=192.168.1.112 node dist/get-devices.rx.js`.

The advantage of using the `.env` file is that all scripts will consistently use the specified hostname without needing to set the variable each time.

To log all incoming and outgoing messages from Motion Master, set the `ROAR_LOG=true` environment variable when running your scripts.

Here's an example `.env` file configuration:

```sh
MOTION_MASTER_HOSTNAME=192.168.1.112
ROARR_LOG=true
```

Alternatively, you can run TypeScript scripts directly without transpiling using `ts-node`:

```sh
ts-node src/get-devices.rx.ts
```

## Command line arguments

All commands associated with a specific device require the `--device-ref` option, along with other specific arguments. To view detailed help documentation for any command, use the `--help` option. For example:

```sh
❯ ts-node src/upload.ts --help
Usage: upload [options] <index> <subindex>

Arguments:
  index                     object index in hexadecimal notation
  subindex                  object subindex in hexadecimal notation

Options:
  -d, --device-ref <value>  position, address, or serial number (default: 0 position as the first device in the chain)
  -h, --help                display help for command
```

## Monitoring

To monitor output data and save it to both stdout and a file (data.csv), use:

```sh
node dist/start-monitoring.js | tee data.csv
```

## Developing

To watch `.ts` files for changes and automatically transpile, use:

```sh
npm run watch
```
