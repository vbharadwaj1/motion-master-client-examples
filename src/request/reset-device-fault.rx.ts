import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { client, logStringified } from '../init-client';
import { mergeMap } from 'rxjs';

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.resetDeviceFault(deviceRefObj, requestTimeout, messageId)),
).subscribe({
  next: logStringified,
  complete: () => client.closeSockets(),
});
