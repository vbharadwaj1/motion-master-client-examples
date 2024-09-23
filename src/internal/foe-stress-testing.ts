import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { readFileSync } from 'fs';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    // const content = readFileSync('src/internal/config.csv', 'utf-8');
    // await lastValueFrom(client.request.loadConfig(deviceRef, content, { count: 10, delay: 500 }));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    await lastValueFrom(client.request.getDecodedFile(deviceRef, 'config.csv'));
    const list = await lastValueFrom(client.request.getFiles(deviceRef));
    console.log(list);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
