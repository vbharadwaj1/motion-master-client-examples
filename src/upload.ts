import { client } from './init-client';
import { program, Argument } from 'commander';

program
  .addArgument(new Argument('<index>', 'object index in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('<subindex>', 'object subindex in hexadecimal notation').argParser((value) => parseInt(value, 16)));

program.parse();

const { deviceRef } = program.opts();
const [index, subindex] = program.processedArgs;

client.whenReady().then(async () => {
  const value = await client.request.upload(deviceRef, index, subindex);
  console.log(value);
  client.closeSockets();
});
