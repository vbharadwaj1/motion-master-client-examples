import { client } from './init-client';
import { mergeMap } from 'rxjs';

client.onceReady$.pipe(
  mergeMap(() => client.request.getSystemLog(2000)),
).subscribe({
  next: (status) => console.log(status?.content),
  complete: () => client.closeSockets(),
});
