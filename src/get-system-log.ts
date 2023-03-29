import { client } from './init-client';
import { first, firstValueFrom } from 'rxjs';
import { parseSystemLogContent, parseSystemLogLine } from 'motion-master-client';

client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const message = await firstValueFrom(client.request.getSystemLog(1000));
  console.log(message.content);

  client.closeSockets();
}
