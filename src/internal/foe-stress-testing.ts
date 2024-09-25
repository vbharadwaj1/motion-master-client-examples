import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { readFileSync } from 'fs';
import { makeDeviceRefObj, resolveAfter } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    const contentBuffer = readFileSync('src/internal/config.csv');
    const content = new Uint8Array(contentBuffer);

    const requests = [
      () => lastValueFrom(client.request.deleteFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
      () => lastValueFrom(client.request.setFile(deviceRef, 'config.csv', content)),
      () => lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.setFile(deviceRef, 'config.csv', content)),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
      () => lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.loadConfig(deviceRef, content, { count: 10, delay: 500 })),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
      () => lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.deleteFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
    ];

    for (const request of requests) {
      const result = await request();
      console.log(result);
      await resolveAfter(1000);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
