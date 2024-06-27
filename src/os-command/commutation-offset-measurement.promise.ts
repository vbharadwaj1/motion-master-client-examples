import { program } from 'commander';
import { client } from '../init-client';
import { lastValueFrom } from 'rxjs';
import { ModesOfOperation, Cia402State } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    await lastValueFrom(client.request.setModesOfOperation(deviceRef, ModesOfOperation.DIAGNOSTICS_MODE));
    await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

    const response = await lastValueFrom(client.request.runCommutationOffsetMeasurementOsCommand(deviceRef));

    if (response.request === 'failed') {
      console.error(`Commutation angle offset measurement has failed! Error: ${response.errorDescription} (${response.errorCode})`);
    } else if (response.request === 'succeeded') {
      console.log(`Measured a commutation angle offset of ${response.commutationAngleOffset}.`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
}).finally(() => client.closeSockets());
