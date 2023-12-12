import { program } from 'commander';
import { client, logStatus } from './init-client';
import { forkJoin, mergeMap } from 'rxjs';

program.parse();

const { requestTimeout = 5000 } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => client.request.getDevices(3000)),
  mergeMap((devices) => forkJoin(devices.map(({ deviceAddress }) => client.request.resetDeviceFault({ deviceAddress }, requestTimeout)))),
).subscribe({
  next: (statuses) => statuses.forEach(logStatus),
  complete: () => client.closeSockets(),
});
