import { program } from 'commander';
import { client, logStringifiedStatus } from '../init-client';
import { mergeMap } from 'rxjs';

program.parse();

const { requestTimeout = 2000, messageId } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => client.request.getSystemVersion(requestTimeout, messageId)),
).subscribe({
  next: logStringifiedStatus,
  complete: () => client.closeSockets(),
});
