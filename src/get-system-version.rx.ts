import { client } from './init-client';
import { mergeMap } from 'rxjs';

client.onceReady$.pipe(
  mergeMap(() => client.request.getSystemVersion(2000)),
).subscribe({
  next: (status) => console.log(`System version is ${status?.version}`),
  complete: () => client.closeSockets(),
});
