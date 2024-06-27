// This script will first resolve the firmware packages for each device and then install them.
// Prerequisite steps:
// 1. Visit https://bundles.synapticon.com and download a firmware bundle, e.g., somanet-motion-drive_v5.1.4.odbx.
// 2. Rename the downloaded file from somanet-motion-drive_v5.1.4.odbx to somanet-motion-drive_v5.1.4.tar.gz and unpack it.
// 3. Copy the contents of `somanet-motion-drive_v5.1.4/cache/s3/synapticon/oblac-drives/brands/a7e925fa-57b7-4741-9126-0840a63cdb71/packages` to the ./tmp/ directory.
// 4. Run the script with: `node ./dist/start-device-firmware-installation-on-all-devices.js`.

import { client } from "./init-client";
import { readdirSync, readFileSync } from 'fs';
import { Device, DeviceFirmwareInstallationStatus, isHardwareDescriptionCompatibleWithPackageFilename } from "motion-master-client";
import { join } from 'path';
import { firstValueFrom, combineLatest } from "rxjs";

const packagesDir = join(__dirname, '..', 'tmp', 'packages');
const packageFilenames = readdirSync(packagesDir);

let devices: Device[];

client.whenReady().then(async () => {
  devices = await firstValueFrom(client.request.getDevices(10000));

  const resolvedPackages = devices.reduce((items, { deviceAddress, hardwareDescription, id }) => {
    if (hardwareDescription) {
      const packageFilename = packageFilenames.find((filename) => isHardwareDescriptionCompatibleWithPackageFilename(hardwareDescription, filename));
      if (packageFilename) {
        const buffer = readFileSync(join(packagesDir, packageFilename));
        items.push([deviceAddress, buffer]);
      } else {
        console.error(`No package file found for device ${id}. Exiting...`);
        process.exit(1);
      }
    }
    return items;
  }, [] as [number, Buffer][]);

  combineLatest(
    resolvedPackages.map(([deviceAddress, firmwarePackageContent]) =>
      client.request.startDeviceFirmwareInstallation({ deviceAddress, firmwarePackageContent }, 60000))
  ).subscribe({
    next: printStatuses,
    complete: () => client.closeSockets(),
  });
});

function printStatuses(statuses: DeviceFirmwareInstallationStatus[]) {
  const messages = mapStatusesToMessages(statuses);
  const json = JSON.stringify(messages);
  console.clear();
  console.log(json);
}

function mapStatusesToMessages(statuses: DeviceFirmwareInstallationStatus[]) {
  return statuses.map((status, index) => {
    const id = devices[index]?.id;
    if (status.request === 'succeeded') {
      return `${id}: ${status.success?.message} (${status.success?.code}) 100%`;
    } else if (status.request === 'failed') {
      return `${id}: ${status.error?.message} (${status.error?.code})`;
    } else if (status.request === 'running') {
      return `${id}: ${status.progress?.message} ${status.progress?.percentage ?? 0}%`;
    }
  });
}
