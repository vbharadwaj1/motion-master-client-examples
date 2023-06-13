import { client, logStatus } from './init-client';
import { firstValueFrom, forkJoin } from 'rxjs';

client.whenReady().then(async () => {
  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.resetDeviceFault({ deviceAddress }, 2000));
  const statuses = await firstValueFrom(forkJoin(requests$));

  statuses.forEach(logStatus);
}).finally(() => client.closeSockets());
