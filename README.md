# motion-master-client-examples

## Building

Before executing scripts, you must transpile from TypeScript to JavaScript:

```sh
npm run build
```

The built JavaScript files are then available in the `dist/` folder.

## Running

Before executing a script, you must set the `MOTION_MASTER_HOSTNAME` environment variable. Let's say the Motion Master process runs at `192.168.1.112`, there are at least two ways to do it:

1. Create `.env` file in the root of this repository and add the following line to it: `MOTION_MASTER_HOSTNAME=192.168.1.112`
2. Run a single script by specifying the variable: `MOTION_MASTER_HOSTNAME=192.168.1.112 node dist/get-devices.js`

The advantage of the first approach is that all scripts will use the same hostname, and you don't need to specify the variable when executing a script `node dist/get-devices.js`.

To log all outgoing and incoming Motion Master messages run a script with `ROAR_LOG=true` environment variable.

This is how the `.env` file could look like:

```sh
MOTION_MASTER_HOSTNAME=192.168.1.112
ROARR_LOG=true
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
