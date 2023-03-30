import { client } from './init-client';
import { first, mergeMap, map } from 'rxjs';

client.reqResSocket.opened$.pipe(
  first(Boolean),
  mergeMap(() => client.request.getDeviceFileList({ devicePosition: 0 }, 2000)),
  map((status) => status.fileList?.files ?? []),
).subscribe({
  next: console.log,
  complete: () => client.closeSockets(),
});
