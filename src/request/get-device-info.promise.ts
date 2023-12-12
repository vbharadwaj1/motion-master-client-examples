import { program } from 'commander';
import { client, logStringifiedStatus } from '../init-client';
import { firstValueFrom } from 'rxjs';

program.parse();

const { requestTimeout = 3000, messageId } = program.opts();

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getDeviceInfo(requestTimeout, messageId));
  logStringifiedStatus(status);
}).finally(() => client.closeSockets());
