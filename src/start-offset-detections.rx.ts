import { client, logStatus } from './init-client';
import { forkJoin, mergeMap } from 'rxjs';

client.onceReady$.pipe(
  mergeMap(() => client.request.getDevices(3000)),
  mergeMap((devices) => forkJoin(devices.map(({ deviceAddress }) => client.request.startOffsetDetection({ deviceAddress }, 60000)))),
).subscribe({
  next: (statuses) => statuses.forEach(logStatus),
  complete: () => client.closeSockets(),
});
