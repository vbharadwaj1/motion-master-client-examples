import { client, logStatus } from './init-client';
import { forkJoin, mergeMap } from 'rxjs';
import { MotionMasterMessage } from 'motion-master-client';

const state = MotionMasterMessage.Request.SetEthercatNetworkState.State.OP;

client.onceReady$.pipe(
  mergeMap(() => client.request.getDevices(3000)),
  mergeMap((devices) => forkJoin(devices.map(({ deviceAddress }) => client.request.setEthercatNetworkState({ deviceAddress, state }, 3000)))),
).subscribe({
  next: (statuses) => statuses.forEach(logStatus),
  complete: () => client.closeSockets(),
});
