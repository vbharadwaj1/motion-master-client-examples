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

    // Run the OS command
    const command = [7, 0, 0, 0, 0, 0, 0, 0];
    await client.request.download(deviceRef, 0x1023, 1, command);

    // Poll for the response while in progress
    while (true) {
      await resolveAfter(1000);
      const response = await client.request.upload<number[]>(deviceRef, 0x1023, 3);

      if (response[0] === 255) { // in progress
        process.stdout.write('.');
      } else if (response[0] === 1) { // completed, no errors, has response data
        console.log(` detected ${response[2]} pole pairs`);
        break;
      } else {
        throw new Error(`Unexpected response: ${response}`);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
}).finally(() => client.closeSockets());
