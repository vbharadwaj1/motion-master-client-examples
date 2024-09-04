import { program } from 'commander';
import { client } from '../init-client';
import { IntegroEncoderCalibration } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    const integroEncoderCalibration = new IntegroEncoderCalibration(client, deviceRef);
    integroEncoderCalibration.notifications$.subscribe(console.log);
    await integroEncoderCalibration.start();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`ERROR: ${err.message}`);
    }
  }
}).finally(() => client.closeSockets());
