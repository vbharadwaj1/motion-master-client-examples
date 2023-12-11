import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { firstValueFrom, map } from 'rxjs';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.whenReady().then(async () => {
  const parameters = await firstValueFrom(
    client.request.getDeviceParameterInfo(deviceRefObj, 3000).pipe(
      map((status) => status.parameters ?? []),
    ),
  );
  console.log(
    JSON.stringify(parameters, null, 2),
  );
}).finally(() => client.closeSockets());
