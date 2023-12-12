import { Argument, program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { client, logStringifiedStatus } from '../init-client';
import { mergeMap } from 'rxjs';

program
  .addArgument(new Argument('[skipAutoTuning]')
    .argOptional()
    .default(false)
    .choices(['true', 'false'])
    .argParser((value) => value.toLowerCase() === 'true'));

program.parse();

const { deviceRef, requestTimeout = 120000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [skipAutoTuning] = program.processedArgs;

client.onceReady$.pipe(
  mergeMap(() => client.request.startCoggingTorqueRecording({ ...deviceRefObj, skipAutoTuning }, requestTimeout, messageId)),
).subscribe({
  next: logStringifiedStatus,
  complete: () => client.closeSockets(),
});
