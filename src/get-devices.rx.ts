import { client } from './init-client';
import { mergeMap } from 'rxjs';

client.onceReady$.pipe(
  mergeMap(() => client.request.getDevices()),
).subscribe({
  next: (devices) => {
    const json = JSON.stringify(devices, null, 2);
    console.log(json);
  },
  complete: () => client.closeSockets(),
});
