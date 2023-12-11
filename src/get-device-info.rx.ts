import { client } from './init-client';
import { mergeMap } from 'rxjs';

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceInfo(5000)),
).subscribe({
  next: (status) => console.log(JSON.stringify(status?.devices, null, 2)),
  complete: () => client.closeSockets(),
});
