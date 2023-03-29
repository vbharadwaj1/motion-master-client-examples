import { client } from './init-client';
import { first, firstValueFrom, forkJoin } from 'rxjs';
import { MotionMasterMessage } from 'motion-master-client';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.getEthercatNetworkState({ deviceAddress }, 2000));

  forkJoin(requests$).subscribe({
    next: (statuses) => {
      statuses.forEach((status) => {
        const device = devices.find((device) => device.deviceAddress === status.deviceAddress);
        if (status.error) {
          console.error(`Get EtherCAT network state failed for device ${device?.id}: (${status.error.code}) ${status.error.message}`);
        } else {
          const value = MotionMasterMessage.Status.EthercatNetworkState.State[Number(status.state)];
          console.log(`${device?.id}: ${value}`);
        }
      });
    },
    complete() {
      client.closeSockets();
    },
  });
}
