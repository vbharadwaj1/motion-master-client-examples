import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

client.whenReady().then(async () => {
  const devices = await firstValueFrom(client.request.getDevices());
  const json = JSON.stringify(devices, null, 2);
  console.log(json);
}).finally(() => client.closeSockets());

// (async function () {
//   await client.whenReady();

//   const devices = await firstValueFrom(client.request.getDevices());
//   const json = JSON.stringify(devices, null, 2);
//   console.log(json);

//   client.closeSockets();
// })();
