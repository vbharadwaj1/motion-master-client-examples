import { Argument, program } from 'commander';
import { client } from './init-client';
import { Cia402State } from 'motion-master-client';

program
  .addArgument(new Argument('<target>', '0x6071: Target Torque').argParser(parseInt))
  .addArgument(new Argument('<slope>', '0x6087: Torque slope').argParser(parseInt));

program.parse();

const { deviceRef } = program.opts();
const [targetTorque, torqueSlope] = program.processedArgs;

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 4], // profile torque mode
    [deviceRef, 0x6071, 0, targetTorque], // target torque
    [deviceRef, 0x6087, 0, torqueSlope], // torque slope
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);
}).finally(() => client.closeSockets());
