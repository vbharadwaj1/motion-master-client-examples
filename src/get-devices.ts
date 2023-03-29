import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const devices = await firstValueFrom(client.request.getDevices(2000));
  const json = JSON.stringify(devices, null, 2);
  console.log(json);
  
  client.closeSockets();
}
