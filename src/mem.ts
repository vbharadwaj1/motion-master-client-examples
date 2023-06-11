import { client } from './init-client';
import { bufferCount, distinctUntilChanged, map, mergeMap, Subscription, tap } from 'rxjs';

let subscription: Subscription;

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

subscription = client.onceReady$.pipe(
  mergeMap(() => client.startMonitoringValue([0, 0x6064, 0], 500000)),
  bufferCount(6),
  map((values) => {
    const sum = values
      .map(v => Math.abs(v))
      .reduce((p, v) => (p + v), 0);
    const avg = sum / values.length;
    const pos = avg % 4096;
    const val = pos / (4096 / 26);
    return Math.floor(val);
  }),
  distinctUntilChanged(),
).subscribe((value) => {
  console.log(String.fromCharCode(65 + value));
});
