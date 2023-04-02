import { client } from './init-client';
import { first, mergeMap } from 'rxjs';

client.socketsOpened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getSystemLog(2000)),
).subscribe({
  next: (status) => console.log(status?.content),
  complete: () => client.closeSockets(),
});
