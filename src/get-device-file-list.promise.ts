import { client } from './init-client';
import { first, firstValueFrom, map } from 'rxjs';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const fileList = await firstValueFrom(
    client.request.getDeviceFileList({ devicePosition: 0 }, 2000).pipe(
      map((status) => status.fileList?.files ?? []),
    ),
  );
  console.log(fileList);

  client.closeSockets();
})();
