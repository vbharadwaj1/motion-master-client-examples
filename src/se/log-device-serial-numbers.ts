import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { HardwareDescription } from 'motion-master-client';

client.whenReady().then(async () => {
  try {
    console.log('Option 1: Get devices, including their hardware description and serial number.');
    const devices = await lastValueFrom(client.request.getDevices());
    devices.forEach((device) => {
      const serialNumber = device.hardwareDescription?.device.serialNumber;
      console.log(serialNumber);
    });

    console.log('Option 2: Read the .hardware_description file of the first device directly and extract its serial number.');
    const content = await lastValueFrom(client.request.getDecodedFile(1, '.hardware_description'));
    if (content) {
      const hardwareDescription = JSON.parse(content) as HardwareDescription;
      const serialNumber = hardwareDescription?.device.serialNumber;
      console.log(serialNumber);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
