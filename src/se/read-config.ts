import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    const content = await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    console.log(content);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
