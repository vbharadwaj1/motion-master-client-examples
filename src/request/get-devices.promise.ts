import { program } from 'commander';
import { client, logStringified } from '../init-client';
import { firstValueFrom } from 'rxjs';

program.parse();

const { requestTimeout = 30000 } = program.opts();

client.whenReady().then(async () => {
  const devices = await firstValueFrom(client.request.getDevices(requestTimeout));
  logStringified(devices);
}).finally(() => client.closeSockets());
