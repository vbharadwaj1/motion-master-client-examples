import { program, Argument } from 'commander';
import { client } from './init-client';

program
  .addArgument(new Argument('<index>', 'object index in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('<subindex>', 'object subindex in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('<value>', 'object value'));

program.parse();

const { deviceRef } = program.opts();
const [index, subindex, value] = program.processedArgs;

client.whenReady().then(async () => {
  await client.request.download(deviceRef, index, subindex, value);
}).finally(() => client.closeSockets());
