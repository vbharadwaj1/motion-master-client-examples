// Command 7: Pole pair detection
// This command can only be executed when the operation mode is set to -2 (OPMODE_DIAGNOSTICS) and the CiA402 state is in Operation enabled.

import { program } from 'commander';
import { Cia402State, resolveAfter } from 'motion-master-client';
import { client } from '../init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  try {
    // switch to -2 (OPMODE_DIAGNOSTICS) operation mode and transition to OP CiA402 state
    await client.request.download(deviceRef, 0x6060, 0, -2);
    await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

    // Just in case read and ignore the response of previous OS command
    await client.request.upload(deviceRef, 0x1023, 3, false, 5000);

    // Run the OS command
    const command = [7, 0, 0, 0, 0, 0, 0, 0];
    const buffer = new Uint8Array(command);
    await client.request.download(deviceRef, 0x1023, 1, buffer, 'rawValue', 5000); // TODO: Don't specify rawValue

    while (true) {
      await resolveAfter(2000);
      const status = await client.request.upload<Uint8Array>(deviceRef, 0x1023, 3, false, 3000); // TODO: Change Uint8Array to number[]
      if (status[0] !== 255) {
        console.log(status);
        break;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
}).finally(() => client.closeSockets());
