import { program } from 'commander';
import { client, logStringified } from '../init-client';
import { mergeMap } from 'rxjs';

program.parse();

const { requestTimeout = 30000 } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => client.request.getDevices(requestTimeout)),
).subscribe({
  next: logStringified,
  complete: () => client.closeSockets(),
});
