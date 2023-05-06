import { client, logStatus } from './init-client';
import { forkJoin, mergeMap } from 'rxjs';

client.ready$.pipe(
  mergeMap(() => client.request.getDevices(3000)),
  mergeMap((devices) => forkJoin(devices.map(({ deviceAddress }) => client.request.resetDeviceFault({ deviceAddress }, 2000)))),
).subscribe({
  next: (statuses) => statuses.forEach(logStatus),
  complete: () => client.closeSockets(),
});
