import { program } from 'commander';
import { client } from './init-client';
import { Cia402State } from 'motion-master-client';
import { lastValueFrom } from 'rxjs';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  const positionActualValue = await client.request.upload(deviceRef, 0x6064, 0);
  const resolution = await client.request.upload(deviceRef, 0x2110, 3); // 524288
  const targetPosition = positionActualValue + resolution; // one full rotation

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 1], // profile position mode
    [deviceRef, 0x6067, 0, 500], // position window
    [deviceRef, 0x607A, 0, targetPosition], // target position
    [deviceRef, 0x6081, 0, 10000], // profile velocity
    [deviceRef, 0x6083, 0, 10000], // profile acceleration
    [deviceRef, 0x6084, 0, 10000], // profile deceleration
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);
  await client.request.applySetPoints(deviceRef);

  await lastValueFrom(client.waitUntilTargetReached(deviceRef));
  console.log('tr - target reached');
}).finally(() => client.closeSockets());
