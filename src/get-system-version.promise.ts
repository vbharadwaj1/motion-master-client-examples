import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const status = await firstValueFrom(client.request.getSystemVersion(2000));
  console.log(`System version is ${status?.version}`);

  client.closeSockets();
})();
