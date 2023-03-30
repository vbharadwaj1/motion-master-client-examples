import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const status = await firstValueFrom(client.request.getSystemLog(2000));
  console.log(status?.content);

  client.closeSockets();
})();
