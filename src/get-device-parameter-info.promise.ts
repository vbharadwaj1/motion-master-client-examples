import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { firstValueFrom } from 'rxjs';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getDeviceParameterInfo(deviceRefObj, 5000));
  console.log(JSON.stringify(status?.parameters, null, 2));
}).finally(() => client.closeSockets());
