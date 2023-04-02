import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

(async function () {
  await client.whenReady();

  const devices = await firstValueFrom(client.request.getDevices());
  const json = JSON.stringify(devices, null, 2);
  console.log(json);

  client.closeSockets();
})();
