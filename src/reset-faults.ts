import { client, logStatus } from './init-client';
import { first, firstValueFrom, forkJoin } from 'rxjs';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const devices = await firstValueFrom(client.request.getDevices(3000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.resetDeviceFault({ deviceAddress }, 2000));

  forkJoin(requests$).subscribe({
    next: (statuses) => {
      statuses.forEach((status) => {
        const device = devices.find((device) => device.deviceAddress === status.deviceAddress);
        logStatus(status, 'Reset fault', device?.id);
      });
    },
    complete() {
      client.closeSockets();
    },
  });
}
