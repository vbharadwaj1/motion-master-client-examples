import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { mergeMap } from 'rxjs';
import { client, logStatus } from './init-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.startOffsetDetection(deviceRefObj, 60000)),
).subscribe({
  next: logStatus,
  complete: () => client.closeSockets(),
});
