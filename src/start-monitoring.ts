import { makeParameterId } from 'motion-master-client';
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
  [0, 0x6041, 0], // Statusword
  [0, 0x6061, 0], // Modes of operation display
  [0, 0x6064, 0], // Position actual value
  [0, 0x606C, 0], // Velocity actual value
  [0, 0x6077, 0], // Torque actual value
  [0, 0x2401, 0], // Analog input 1
  [0, 0x2402, 0], // Analog input 1
  [0, 0x2403, 0], // Analog input 1
  [0, 0x2404, 0], // Analog input 1
  [0, 0x2702, 0], // Tuning status
  [0, 0x60FD, 0], // Digital inputs
  [0, 0x2704, 0], // User MISO
  [0, 0x60FC, 0], // Position demand internal value
  [0, 0x606B, 0], // Velocity demand value
  [0, 0x6074, 0], // Torque demand
];

const names = ids.map(([, index, subindex]) => makeParameterId(index, subindex));
console.log(names.join(','));

subscription = client.ready$.pipe(
  mergeMap(() => client.startMonitoring(ids, 100000)),
).subscribe((values) => {
  // console.log(values);
  console.log(values.map(longToNumber).join(','));
});
