import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getSystemLog(2000));
  console.log(status?.content);
}).finally(() => client.closeSockets());
