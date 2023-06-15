import { program } from 'commander';
import { client } from './init-client';
import { Cia402State } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  let positionActualValue = await client.request.upload(deviceRef, 0x6064, 0);
  console.log(`Position actual value is ${positionActualValue}.`);
  const resolution = await client.request.upload(deviceRef, 0x2110, 3); // 524288
  console.log(`Resolution is ${resolution}.`);
  const targetPosition = positionActualValue + resolution; // one full rotation
  console.log(`Target position is ${targetPosition} (one full rotation)`);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 1], // profile position mode
    [deviceRef, 0x6067, 0, 10], // position window
    [deviceRef, 0x607A, 0, targetPosition], // target position
    [deviceRef, 0x6081, 0, 10000], // profile velocity
    [deviceRef, 0x6083, 0, 10000], // profile acceleration
    [deviceRef, 0x6084, 0, 10000], // profile deceleration
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);
  await client.request.applySetPoint(deviceRef);
  await client.whenTargetReached(deviceRef);
  positionActualValue = await client.request.upload(deviceRef, 0x6064, 0);
  console.log(`Target reached! Position actual value is ${positionActualValue}.`);
}).finally(() => client.closeSockets());
