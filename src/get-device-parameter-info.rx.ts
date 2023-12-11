import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { mergeMap } from 'rxjs';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceParameterInfo(deviceRefObj, 5000)),
).subscribe({
  next: (status) => console.log(JSON.stringify(status.parameters, null, 2)),
  complete: () => client.closeSockets(),
});
