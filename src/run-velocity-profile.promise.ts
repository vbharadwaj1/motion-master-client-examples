import { Cia402State } from 'motion-master-client';
import { client } from './init-client';

const deviceRef = 0;

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 3], // profile velocity mode
    [deviceRef, 0x60FF, 0, 250], // target velocity
    [deviceRef, 0x6083, 0, 5000], // profile acceleration
    [deviceRef, 0x6084, 0, 5000], // profile deceleration
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

  client.closeSockets();
});
