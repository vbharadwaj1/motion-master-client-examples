# motion-master-client-examples

## Building

Transpile from TypeScript to JavaScript:

```sh
npm run build
```

The built JavaScript files are then available in the `dist/` folder.

## Running

Before executing a script, you must set the `MOTION_MASTER_HOSTNAME` environment variable. Let's say the Motion Master process runs at `192.168.1.112`, there are at least two ways to do it:

1. Create `.env` file in the root of this repository and add the following line to it: `MOTION_MASTER_HOSTNAME=192.168.1.112`
2. Run a single script by specifying the variable: `MOTION_MASTER_HOSTNAME=192.168.1.112 node dist/get-devices.rx.js`

The advantage of the first approach is that all scripts will use the same hostname, and you don't need to specify the variable when executing a script `node dist/get-devices.rx.js`.

To log all outgoing and incoming Motion Master messages run a script with `ROAR_LOG=true` environment variable.

This is how the `.env` file could look like:

```sh
MOTION_MASTER_HOSTNAME=192.168.1.112
ROARR_LOG=true
```

You can also run the scripts directly, without transpiling, using ts-node.

```sh
ts-node src/get-devices.rx.ts
```

## Command line arguments


All commands that are associated with a single device include the `--device-ref` option along with specific arguments for each command. If you need to access the help documentation for any command, you can simply use the command followed by the `--help` option. This will display a list of available arguments and options for that particular command. For example:

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

Output monitoring data to both stdout and file:

```sh
node dist/start-monitoring.js | tee data.csv
```

## Developing

Watch `.ts` files for changes and transpile automatically:

```sh
npm run watch
```
