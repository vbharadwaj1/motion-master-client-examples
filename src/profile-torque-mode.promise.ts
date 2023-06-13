import { program } from 'commander';
import { client } from './init-client';
import { Cia402State } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 4], // profile torque mode
    [deviceRef, 0x6071, 0, 500], // target torque
    [deviceRef, 0x6087, 0, 100], // torque slope
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);
}).finally(() => client.closeSockets());
