import { program } from 'commander';
import { client } from '../init-client';
import { concat, from, mergeMap } from 'rxjs';
import { ModesOfOperation, Cia402State } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.onceReady$.pipe(
  mergeMap(() => concat(
    client.request.setModesOfOperation(deviceRef, ModesOfOperation.DIAGNOSTICS_MODE),
    from(client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED)),
    client.request.runCommutationOffsetMeasurementOsCommand(deviceRef),
  )),
).subscribe({
  next: (response) => {
    if (response) {
      if (response.request === 'running') {
        process.stdout.write('.');
      } else if (response.request === 'failed') {
        console.error(` commutation angle offset measurement has failed! Error: ${response.errorDescription} (${response.errorCode})`);
      } else if (response.request === 'succeeded') {
        console.log(` measured a commutation angle offset of ${response.commutationAngleOffset}.`);
      }
    }
  },
  error: (err) => {
    console.log(err);
  },
  complete: () => {
    client.closeSockets();
  }
});
