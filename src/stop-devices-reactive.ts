import { client, logStatus } from './init-client';
import { first, forkJoin, mergeMap } from 'rxjs';

client.reqResSocket.opened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getDevices(3000)),
  mergeMap((devices) => forkJoin(devices.map(({ deviceAddress }) => client.request.stopDevice({ deviceAddress }, 2000)))),
).subscribe({
  next: (statuses) => {
    statuses.forEach((status) => {
      logStatus(status, 'Stop device', status.deviceAddress.toString());
    });
  },
  complete() {
    client.closeSockets();
  },
});
