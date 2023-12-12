import { Argument, program } from 'commander';
import { MotionMasterMessage, makeDeviceRefObj } from 'motion-master-client';
import { client, logStringifiedStatus } from '../init-client';
import { mergeMap } from 'rxjs';

program.addArgument(
  new Argument('<state>', 'CiA402 state')
    .choices(Object.keys(MotionMasterMessage.Status.DeviceCiA402State.State))
    .argParser((value: any) => MotionMasterMessage.Status.DeviceCiA402State.State[value])
);

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [state] = program.processedArgs as [MotionMasterMessage.Status.DeviceCiA402State.State];

client.onceReady$.pipe(
  mergeMap(() => client.request.setDeviceCia402State({ ...deviceRefObj, state }, requestTimeout, messageId)),
).subscribe({
  next: logStringifiedStatus,
  complete: () => client.closeSockets(),
});
