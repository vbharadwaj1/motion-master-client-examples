import { program } from 'commander';
import { client, logStringified } from '../init-client';
import { firstValueFrom } from 'rxjs';

program.parse();

const { requestTimeout = 2000, messageId } = program.opts();

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getSystemVersion(requestTimeout, messageId));
  logStringified(status);
}).finally(() => client.closeSockets());
