import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { client, logStringifiedStatus } from '../init-client';
import { mergeMap } from 'rxjs';

program.parse();

const { deviceRef, requestTimeout = 10000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.getCoggingTorqueData(deviceRefObj, requestTimeout, messageId)),
).subscribe({
  next: logStringifiedStatus,
  complete: () => client.closeSockets(),
});
