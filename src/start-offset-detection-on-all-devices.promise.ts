import { program } from 'commander';
import { client, logStatus } from './init-client';
import { firstValueFrom, forkJoin } from 'rxjs';

program.parse();

const { requestTimeout = 60000 } = program.opts();

client.whenReady().then(async () => {
  const devices = await firstValueFrom(client.request.getDevices(10000));

  const requests$ = devices.map(({ deviceAddress }) => client.request.startOffsetDetection({ deviceAddress }, requestTimeout))
  const statuses = await firstValueFrom(forkJoin(requests$));

  statuses.forEach(logStatus);
}).finally(() => client.closeSockets());
