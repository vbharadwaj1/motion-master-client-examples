import { client, longToNumber } from './init-client';
import { first, mergeMap, Subscription } from 'rxjs';

let subscription: Subscription;

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

const ids: [number, number, number][] = [
  [0, 0x20F0, 0], // Timestamp
  [0, 0x6064, 0], // Position actual value
  [0, 0x606C, 0], // Velocity actual value
  [0, 0x6077, 0], // Torque actual value
  [0, 0x2030, 1], // Core temperature / Measured temperature
  [0, 0x2031, 1], // Drive temperature / Measured temperature
];

const names = [
  'Timestamp',
  'Position',
  'Velocity',
  'Torque',
  'Core temp.',
  'Drive temp.',
];

console.log(names.join(', '));

subscription = client.reqResSocket.opened$.pipe(
  first(Boolean),
  mergeMap(() => client.startMonitoring(ids, 1000000)),
).subscribe((values) => {
  // console.log(values);
  console.log(values.map(longToNumber));
});
