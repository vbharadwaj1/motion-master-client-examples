import { program } from 'commander';
import { forkJoin, mergeMap } from 'rxjs';
import { client, logStatus } from './init-client';

program.parse();

const { requestTimeout = 60000 } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => client.request.getDevices(10000)),
  mergeMap((devices) => forkJoin(devices.map(({ deviceAddress }) => client.request.startOffsetDetection({ deviceAddress }, requestTimeout)))),
).subscribe({
  next: (statuses) => statuses.forEach(logStatus),
  complete: () => client.closeSockets(),
});
