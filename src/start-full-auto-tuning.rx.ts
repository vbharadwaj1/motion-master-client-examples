import { Device } from 'motion-master-client/src/lib/device';
import { client } from './init-client';
import { first, mergeMap, combineLatest, tap } from 'rxjs';

let devices: Device[];

client.socketsOpened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getDevices(3000)),
  tap((d) => { devices = d }),
  mergeMap((devices) => combineLatest(devices.map(({ deviceAddress }) => client.request.startFullAutoTuning({ deviceAddress, controllerType: 0 }, 60000)))),
).subscribe({
  next: (statuses) => {
    const json = JSON.stringify(
      statuses.map((status, index) => {
        const id = devices[index]?.id;
        if (status.request === 'succeeded') {
          return `${id}: 100%, dampingRatio: ${status.dampingRatio}, settlingTime: ${status.settlingTime}`;
        } else if (status.request === 'failed') {
          return `${id}: FAILED`;
        } else if (status.request === 'running') {
          return `${id}: ${status.progress?.percentage ?? 0}%`;
        }
      })
    );
    console.clear();
    console.log(json);
  },
  complete: () => client.closeSockets(),
});
