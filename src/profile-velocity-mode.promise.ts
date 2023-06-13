import { Argument, program } from 'commander';
import { client } from './init-client';
import { Cia402State } from 'motion-master-client';

program
  .addArgument(new Argument('<target>', '0x60FF: Target velocity').argParser(parseInt))
  .addArgument(new Argument('<acceleration>', '0x6083: Profile acceleration').argParser(parseInt))
  .addArgument(new Argument('<deceleration>', '0x6084: Profile deceleration').argParser(parseInt));

program.parse();

const { deviceRef } = program.opts();
const [targetVelocity, profileAcceleration, profileDeceleration] = program.processedArgs;

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 3], // profile velocity mode
    [deviceRef, 0x60FF, 0, targetVelocity],
    [deviceRef, 0x6083, 0, profileAcceleration],
    [deviceRef, 0x6084, 0, profileDeceleration],
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);
}).finally(() => client.closeSockets());
