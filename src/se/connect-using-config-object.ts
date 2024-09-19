import { createMotionMasterClient } from "motion-master-client";
import { mergeMap } from "rxjs";
import { v4, version } from "uuid";

Object.assign(globalThis, { WebSocket: require('ws') });

const client = createMotionMasterClient({
  clientId: v4(),
  hostname: '127.0.0.1',
  pingSystemInterval: 250,
  pubSubPort: 63525,
  reqResPort: 63524,
  systemAliveTimeout: 1000,
});

client.onceReady$.pipe(
  mergeMap(() => client.request.getSystemVersion(5000)),
).subscribe({
  next: ({ version }) => console.log(`Motion Master version is ${version}.`),
  complete: () => client.closeSockets(),
});
