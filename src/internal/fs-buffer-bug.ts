import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { makeDeviceRefObj, resolveAfter } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

// Tested on firmware v5.3.0-beta.3
// Device: Circulo 7 (8504-03)

client.whenReady().then(async () => {
  // Setting the fs-buffer will cause subsequent file requests to fail until a certain amount of time has passed.
  try {
    console.log('Setting the contents of the fs-buffer file...');
    const content = Uint8Array.from([65, 66, 67]);
    await lastValueFrom(client.request.setDeviceFile({ ...deviceRefObj, name: 'fs-buffer', content }, 5000));
    console.log('Done.');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR 1: ${err.message}`);

    }
  }

  // This file read request is likely to fail.
  try {
    console.log('Reading the config.csv file...');
    const config = await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    console.log(config);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR 2: ${err.message}`);
    }
  }

  // Waiting less than 3 seconds may result in the next file request failing.
  console.log('Waiting for 3 seconds...');
  await resolveAfter(3000);

  // This file read request is expected to succeed.
  try {
    console.log('Reading the config.csv file...');
    const config = await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    console.log(config)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR 3: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
