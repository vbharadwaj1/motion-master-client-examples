import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getSystemVersion(2000));
  console.log(`System version is ${status?.version}`);
}).finally(() => client.closeSockets());
