import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    await lastValueFrom(client.request.saveConfig(deviceRef));
    console.log('Parameters have been successfully saved to the config.csv file on the device.');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
