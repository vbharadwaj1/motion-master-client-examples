# motion-master-client-examples

## Running

Before executing a script you must set the MOTION_MASTER_HOSTNAME environment variable. Let's say the Motion Master process runs on 192.168.1.112 there are at least two way to do it:

1. Create `.env` file and add the following line: `MOTION_MASTER_HOSTNAME=192.168.1.112`.
2. Run a single script by specifying the variable: `$ MOTION_MASTER_HOSTNAME=192.168.1.112 node index.js`

The advantage of first approach is that all scripts will use the same hostname.

## Developing

Build or watch for `.ts` files for changes:

```
$ npm run build
$ npm run watch
```
