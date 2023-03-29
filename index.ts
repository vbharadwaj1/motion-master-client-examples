Object.assign(global, { WebSocket: require('ws') });
import { first, firstValueFrom } from 'rxjs';
import { createMotionMasterClient } from "motion-master-client";

const client = createMotionMasterClient('192.168.1.112');
client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const message = await firstValueFrom(client.request.getSystemVersion(1000));
  console.log(`System version is ${message?.version}`);

  client.closeSockets();
}
