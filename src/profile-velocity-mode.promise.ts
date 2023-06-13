import { program } from 'commander';
import { client } from './init-client';
import { Cia402State } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 3], // profile velocity mode
    [deviceRef, 0x60FF, 0, 50000], // target velocity
    [deviceRef, 0x6083, 0, 10000], // profile acceleration
    [deviceRef, 0x6084, 0, 10000], // profile deceleration
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);
}).finally(() => client.closeSockets());
