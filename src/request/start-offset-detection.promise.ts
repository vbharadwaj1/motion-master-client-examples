import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { client, logStringified } from '../init-client';
import { lastValueFrom } from 'rxjs';

program.parse();

const { deviceRef, requestTimeout = 60000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.whenReady().then(async () => {
  const status = await lastValueFrom(client.request.startOffsetDetection(deviceRefObj, requestTimeout, messageId));
  logStringified(status);
}).finally(() => client.closeSockets());
