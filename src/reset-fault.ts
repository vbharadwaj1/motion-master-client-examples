import { program } from 'commander';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    await client.request.resetFault(deviceRef);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
}).finally(() => client.closeSockets());
