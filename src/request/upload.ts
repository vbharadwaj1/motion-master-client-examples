import { client } from '../init-client';
import { program, Argument } from 'commander';

program
  .addArgument(new Argument('<index>', 'object index in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('<subindex>', 'object subindex in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('[loadFromCache]', 'load parameter values from the Motion Master cache')
    .argOptional()
    .default(false)
    .choices(['true', 'false'])
    .argParser((value) => value.toLowerCase() === 'true'));

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const [index, subindex, loadFromCache] = program.processedArgs as [number, number, boolean];

client.whenReady().then(async () => {
  const value = await client.request.upload(deviceRef, index, subindex, loadFromCache, requestTimeout, messageId);
  console.log(value);
}).finally(() => client.closeSockets());
