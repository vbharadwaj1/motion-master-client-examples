import { client, logStatus } from './init-client';
import { first, firstValueFrom, forkJoin } from 'rxjs';
import { MotionMasterMessage } from 'motion-master-client';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const state = MotionMasterMessage.Request.SetEthercatNetworkState.State.OP;
  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.setEthercatNetworkState({ deviceAddress, state }, 2000));

  forkJoin(requests$).subscribe({
    next: (statuses) => {
      statuses.forEach((status) => {
        const device = devices.find((device) => device.deviceAddress === status.deviceAddress);
        logStatus(status, 'Set EtherCAT network state', device?.id);
      });
    },
    complete() {
      client.closeSockets();
    },
  });
}
