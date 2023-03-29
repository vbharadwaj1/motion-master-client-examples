import { client } from './init-client';
import { first, firstValueFrom, forkJoin } from 'rxjs';
import { MotionMasterMessage } from 'motion-master-client';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const state = MotionMasterMessage.Request.SetEthercatNetworkState.State.OP;
  const devices = await firstValueFrom(client.request.getDevices(3000));

  forkJoin(devices.map(({ deviceAddress }) => client.request.setEthercatNetworkState({ deviceAddress, state }, 2000))).subscribe(
    {
      next: (statuses) => {
        statuses.forEach((status) => {
          if (status.error) {
            console.error(`Failed to set EtherCAT network state on device ${status.deviceAddress}: (${status.error.code}) ${status.error.message}`);
          }
        });
      },
      complete() {
        client.closeSockets();
      },
    }
  );
}
