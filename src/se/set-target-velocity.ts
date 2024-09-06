import { Argument, program } from 'commander';
import { client } from '../init-client';

program
  .addArgument(new Argument('<target>', '0x60FF: Target velocity').argParser(parseInt));

program.parse();

const { deviceRef } = program.opts();
const [targetVelocity] = program.processedArgs;

client.whenReady().then(async () => {
  await client.request.download(deviceRef, 0x60FF, 0, targetVelocity);
}).finally(() => client.closeSockets());
