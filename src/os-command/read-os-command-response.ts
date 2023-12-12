import { program } from 'commander';
import { client } from '../init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    const status = await client.request.upload<Uint8Array>(deviceRef, 0x1023, 3, false, 5000);
    console.log(status);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
}).finally(() => client.closeSockets());
