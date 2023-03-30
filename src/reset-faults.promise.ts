import { client, logStatus } from './init-client';
import { first, firstValueFrom, forkJoin } from 'rxjs';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.resetDeviceFault({ deviceAddress }, 2000));
  const statuses = await firstValueFrom(forkJoin(requests$));

  statuses.forEach(logStatus);

  client.closeSockets();
})();
