import { program } from 'commander';
import { makeParameterId } from 'motion-master-client';
import { client } from './init-client';
import { mergeMap, Subscription } from 'rxjs';

program.parse();

const { deviceRef } = program.opts();

let subscription: Subscription;

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

const ids: [number, number, number][] = [
  [deviceRef, 0x20F0, 0], // Timestamp
  [deviceRef, 0x6040, 0], // Controlword
  [deviceRef, 0x6041, 0], // Statusword
  [deviceRef, 0x6060, 0], // Modes of operation
  [deviceRef, 0x6061, 0], // Modes of operation display
  [deviceRef, 0x6064, 0], // Position actual value
  [deviceRef, 0x606C, 0], // Velocity actual value
  [deviceRef, 0x6077, 0], // Torque actual value
  [deviceRef, 0x60FC, 0], // Position demand internal value
  [deviceRef, 0x606B, 0], // Velocity demand value
  [deviceRef, 0x6074, 0], // Torque demand
];

const names = ids.map(([, index, subindex]) => makeParameterId(index, subindex));
console.log(names.join(','));

subscription = client.onceReady$.pipe(
  mergeMap(() => client.startMonitoring(ids, 100000)),
).subscribe((values) => {
  console.log(values);
});
