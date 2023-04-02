import { client } from './init-client';
import { first, mergeMap } from 'rxjs';

client.socketsOpened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getDevices()),
).subscribe({
  next: (devices) => {
    const json = JSON.stringify(devices, null, 2);
    console.log(json);
  },
  complete: () => client.closeSockets(),
});
