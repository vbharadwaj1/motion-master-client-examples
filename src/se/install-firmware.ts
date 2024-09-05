import { program } from 'commander';
import { client } from '../init-client';
import { mergeMap } from 'rxjs';
import { makeDeviceRefObj } from 'motion-master-client';
import { readFileSync } from 'fs';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

const firmwarePackagePath = 'src/se/package_SOMANET-Integro-60_9002-02_motion-drive_v5.3.0-beta.3+10.g6b9d58d96.zip';
const firmwarePackageContent = readFileSync(firmwarePackagePath);

client.onceReady$.pipe(
  mergeMap(() => client.request.startDeviceFirmwareInstallation({ ...deviceRefObj, firmwarePackageContent, skipSiiInstallation: true }, 120000)),
).subscribe({
  next: (status) => {
    switch (status.request) {
      case 'running':
        console.log(`Firmware installation is in progress: ${status.progress?.percentage ?? -1}% (${status.progress?.message ?? ''})`);
        break;
      case 'succeeded':
        console.log('The firmware installation was successful.');
        break;
      case 'failed':
        console.log(`Firmware installation failed with the following error: ${status.error?.message}`);
        break;
    }
  },
  complete: () => client.closeSockets(),
});
