import { client } from './init-client';
import { first, mergeMap } from 'rxjs';

client.reqResSocket.opened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getSystemVersion(2000)),
).subscribe({
  next: (status) => console.log(`System version is ${status?.version}`),
  complete: () => client.closeSockets(),
});
