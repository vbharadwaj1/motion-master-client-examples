import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getDeviceInfo(5000));
  console.log(JSON.stringify(status?.devices, null, 2));
}).finally(() => client.closeSockets());
