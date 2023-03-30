import { client } from './init-client';
import { first, mergeMap, Subscription } from 'rxjs';

let subscription: Subscription;

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

const ids: [number, number, number][] = [
  [0, 0x2030, 1], // Core temperature / Measured temperature
  [0, 0x2031, 1], // Drive temperature / Measured temperature
];

subscription = client.reqResSocket.opened$.pipe(
  first(Boolean),
  mergeMap(() => client.startMonitoring(ids, 1000000)),
).subscribe((values) => {
  console.log(values);
});
