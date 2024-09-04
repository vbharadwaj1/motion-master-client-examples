import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { makeDeviceRefObj, makeParameterId } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.whenReady().then(async () => {
  try {
    const { parameters } = await lastValueFrom(client.request.getDeviceParameters({ ...deviceRefObj, loadFromCache: true, sendProgress: false }));
    parameters.forEach(p => console.log(`${makeParameterId(p.index, p.subindex)} ${p.name} (${p.value})`));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
