import { client } from './init-client';
import { first, mergeMap, combineLatest } from 'rxjs';

client.socketsOpened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getDevices(3000)),
  mergeMap((devices) => combineLatest(devices.map(({ deviceAddress }) => client.request.startFullAutoTuning({ deviceAddress, controllerType: 0 }, 60000)))),
).subscribe({
  next: (statuses) => {
    const json = JSON.stringify(
      statuses.map((status) => {
        if (status.request === 'succeeded') {
          return `messageId: ${status.messageId}, progress: 100%, dampingRatio: ${status.dampingRatio}, settlingTime: ${status.settlingTime}`;
        } else if (status.request === 'failed') {
          return `messageId: ${status.messageId}, FAILED`;
        } else if (status.request === 'running') {
          return `messageId: ${status.messageId}, progress: ${status.progress?.percentage ?? 0}%`;
        }
      })
    );
    console.clear();
    console.log(json);
  },
  complete: () => client.closeSockets(),
});
