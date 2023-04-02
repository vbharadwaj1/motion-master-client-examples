import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

(async function () {
  await client.whenReady();

  const status = await firstValueFrom(client.request.getSystemLog(2000));
  console.log(status?.content);

  client.closeSockets();
})();
