import { Device } from 'motion-master-client/src/lib/device';
import { client } from './init-client';
import { mergeMap, combineLatest, tap } from 'rxjs';
import { FullAutoTuningStatus } from 'motion-master-client';

let devices: Device[];

client.socketsOpened$.pipe(
  mergeMap(() => client.request.getDevices(3000)),
  tap((d) => { devices = d }),
  mergeMap((devices) => combineLatest(devices.map(({ deviceAddress }) => client.request.startFullAutoTuning({ deviceAddress, controllerType: 0 }, 60000)))),
).subscribe({
  next: printStatuses,
  complete: () => client.closeSockets(),
});

function printStatuses(statuses: FullAutoTuningStatus[]) {
  const messages = mapStatusesToMessages(statuses);
  const json = JSON.stringify(messages);
  console.clear();
  console.log(json);
}

function mapStatusesToMessages(statuses: FullAutoTuningStatus[]) {
  return statuses.map((status, index) => {
    const id = devices[index]?.id;
    if (status.request === 'succeeded') {
      return `${id}: 100%, dampingRatio: ${status.dampingRatio}, settlingTime: ${status.settlingTime}`;
    } else if (status.request === 'failed') {
      return `${id}: FAILED`;
    } else if (status.request === 'running') {
      return `${id}: ${status.progress?.percentage ?? 0}%`;
    }
  });
}
