import { Argument, program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { client, logStringified } from '../init-client';
import { lastValueFrom } from 'rxjs';

program
  .addArgument(new Argument('[skipAutoTuning]')
    .argOptional()
    .default(false)
    .choices(['true', 'false'])
    .argParser((value) => value.toLowerCase() === 'true'));

program.parse();

const { deviceRef, requestTimeout = 120000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [skipAutoTuning] = program.processedArgs as [boolean];

client.whenReady().then(async () => {
  const status = await lastValueFrom(client.request.startCoggingTorqueRecording({ ...deviceRefObj, skipAutoTuning }, requestTimeout, messageId));
  logStringified(status);
}).finally(() => client.closeSockets());
