import { Argument, program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { firstValueFrom, mergeMap } from 'rxjs';
import { client, logStatus } from './init-client';

program
  .addArgument(new Argument('<encoderOrdinal>', 'encoder ordinal').argParser((value) => parseInt(value, 10)));

program.parse();

const [encoderOrdinal] = program.processedArgs;

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.startCirculoEncoderConfiguration({ ...deviceRefObj, encoderOrdinal }, 60000)),
).subscribe({
  next: logStatus,
  complete: () => client.closeSockets(),
});
