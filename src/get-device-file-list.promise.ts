import { client } from './init-client';
import { firstValueFrom, map } from 'rxjs';

(async function () {
  await client.whenReady();

  const fileList = await firstValueFrom(
    client.request.getDeviceFileList({ devicePosition: 0 }, 2000).pipe(
      map((status) => status.fileList?.files ?? []),
    ),
  );
  console.log(fileList);

  client.closeSockets();
})();
