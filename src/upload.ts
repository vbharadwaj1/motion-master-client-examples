import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';
import Long from 'long';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const value = await client.request.upload<Long>(0, 0x2030, 1);
  console.log(value);

  client.closeSockets();
})();
