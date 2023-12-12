import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { firstValueFrom } from 'rxjs';
import { client, logStringifiedStatus } from '../init-client';

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.getDeviceFileList(deviceRefObj, requestTimeout, messageId));
  logStringifiedStatus(status);
}).finally(() => client.closeSockets());
