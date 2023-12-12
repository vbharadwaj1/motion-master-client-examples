import { Argument, program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { mergeMap } from 'rxjs';
import { client, logStringifiedStatus } from '../init-client';

program.addArgument(new Argument('<name>', 'file name, e.g. config.csv'));

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [name] = program.processedArgs as [string];

client.onceReady$.pipe(
  mergeMap(() => client.request.deleteDeviceFile({ ...deviceRefObj, name }, requestTimeout, messageId)),
).subscribe({
  next: logStringifiedStatus,
  complete: () => client.closeSockets(),
});
