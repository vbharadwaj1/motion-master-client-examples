import { program } from 'commander';
import { client } from '../init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    await client.request.quickStop(deviceRef);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
