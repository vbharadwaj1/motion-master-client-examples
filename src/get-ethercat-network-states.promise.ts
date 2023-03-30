import { client, logStatus } from './init-client';
import { first, firstValueFrom, forkJoin } from 'rxjs';
import { MotionMasterMessage } from 'motion-master-client';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.getEthercatNetworkState({ deviceAddress }, 3000));
  const statuses = await firstValueFrom(forkJoin(requests$));

  statuses.forEach((status) => {
    logStatus(status);
    const value = MotionMasterMessage.Status.EthercatNetworkState.State[Number(status.state)];
    console.log(`${status.deviceAddress}: ${value}`);
  });

  client.closeSockets();
})();
