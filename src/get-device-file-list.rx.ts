import { client } from './init-client';
import { mergeMap, map } from 'rxjs';

client.ready$.pipe(
  mergeMap(() => client.request.getDeviceFileList({ devicePosition: 0 }, 2000)),
  map((status) => status.fileList?.files ?? []),
).subscribe({
  next: console.log,
  complete: () => client.closeSockets(),
});
