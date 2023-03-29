require('dotenv').config()
Object.assign(global, { WebSocket: require('ws') });

import { first, firstValueFrom } from 'rxjs';
import { createMotionMasterClient } from "motion-master-client";

if (!process.env.MOTION_MASTER_HOSTNAME) {
  console.error('Error: MOTION_MASTER_HOSTNAME environment variable is not defined.');
  process.exit(1);
}

const client = createMotionMasterClient(process.env.MOTION_MASTER_HOSTNAME);
client.reqResSocket.opened$.pipe(first(Boolean)).subscribe(onOpened);

async function onOpened() {
  const message = await firstValueFrom(client.request.getSystemVersion(1000));
  console.log(`System version is ${message?.version}`);

  client.closeSockets();
}
