import { program } from 'commander';
import { client, logStringifiedStatus } from '../init-client';
import { mergeMap } from 'rxjs';

program.parse();

const { requestTimeout = 3000, messageId } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceInfo(requestTimeout, messageId)),
).subscribe({
  next: logStringifiedStatus,
  complete: () => client.closeSockets(),
});
