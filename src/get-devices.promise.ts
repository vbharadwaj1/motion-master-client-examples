import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';

(async function () {
  await firstValueFrom(client.reqResSocket.opened$.pipe(first(Boolean)));

  const devices = await firstValueFrom(client.request.getDevices());
  const json = JSON.stringify(devices, null, 2);
  console.log(json);

  client.closeSockets();
})();
