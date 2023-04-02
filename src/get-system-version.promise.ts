import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

(async function () {
  await client.whenReady();

  const status = await firstValueFrom(client.request.getSystemVersion(2000));
  console.log(`System version is ${status?.version}`);

  client.closeSockets();
})();
