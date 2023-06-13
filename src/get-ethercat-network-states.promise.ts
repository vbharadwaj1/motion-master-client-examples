import { client, logStatus } from './init-client';
import { firstValueFrom, forkJoin } from 'rxjs';
import { MotionMasterMessage } from 'motion-master-client';

client.whenReady().then(async () => {
  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.getEthercatNetworkState({ deviceAddress }, 3000));
  const statuses = await firstValueFrom(forkJoin(requests$));

  statuses.forEach((status) => {
    logStatus(status);
    const value = MotionMasterMessage.Status.EthercatNetworkState.State[Number(status.state)];
    console.log(`${status.deviceAddress}: ${value}`);
  });
}).finally(() => client.closeSockets());
