import { Cia402State } from 'motion-master-client';
import { client } from './init-client';

const deviceRef = 0;

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  const positionActualValue = await client.request.upload(deviceRef, 0x6064, 0);
  const resolution = await client.request.upload(deviceRef, 0x2110, 3); // 524288
  const targetPosition = positionActualValue + resolution;

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 1], // profile position mode
    [deviceRef, 0x607A, 0, targetPosition], // target position
    [deviceRef, 0x6081, 0, 10000], // profile velocity
    [deviceRef, 0x6083, 0, 10000], // profile acceleration
    [deviceRef, 0x6084, 0, 10000], // profile deceleration
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

  client.closeSockets();
});
