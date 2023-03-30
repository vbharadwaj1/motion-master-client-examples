import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const value = await client.request.upload(0, 0x2030, 1);
  console.log(value);

  client.closeSockets();
})();
