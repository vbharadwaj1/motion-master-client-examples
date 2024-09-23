import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { readFileSync } from 'fs';
import { makeDeviceRefObj } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

// Delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

client.whenReady().then(async () => {
  try {
    const deviceRefObj = makeDeviceRefObj(deviceRef);
    const contentBuffer = readFileSync('src/internal/config.csv');
    const content = new Uint8Array(contentBuffer);

    const tasks = [
      () => lastValueFrom(client.request.deleteDeviceFile({ ...deviceRefObj, name: 'config.csv' }, 10000)),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
      () => lastValueFrom(client.request.setDeviceFile({ ...deviceRefObj, content, name: 'config.csv', overwrite: true }, 10000)),
      () => lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.setDeviceFile({ ...deviceRefObj, content, name: 'config.csv', overwrite: true }, 10000)),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
      () => lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.loadConfig(deviceRef, content, { count: 10, delay: 500 })),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
      () => lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv')),
      () => lastValueFrom(client.request.deleteDeviceFile({ ...deviceRefObj, name: 'config.csv' }, 10000)),
      () => lastValueFrom(client.request.getFiles(deviceRef)),
    ];

    for (const task of tasks) {
      const result = await task(); // Await each task
      console.log(result); // Log the result
      await delay(1000);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());