import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const message = await firstValueFrom(client.request.getSystemVersion(1000));
  console.log(`System version is ${message?.version}`);

  client.closeSockets();
}
