import { program } from 'commander';
import { client, logStringified } from '../init-client';
import { mergeMap } from 'rxjs';

program.parse();

const { requestTimeout = 3000, messageId } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceInfo(requestTimeout, messageId)),
).subscribe({
  next: logStringified,
  complete: () => client.closeSockets(),
});
