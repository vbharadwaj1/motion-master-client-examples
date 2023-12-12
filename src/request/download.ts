import { program, Argument } from 'commander';
import { client } from '../init-client';
import { ParameterTypeValueKey } from 'motion-master-client';

program
  .addArgument(new Argument('<index>', 'object index in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('<subindex>', 'object subindex in hexadecimal notation').argParser((value) => parseInt(value, 16)))
  .addArgument(new Argument('<value>', 'object value'))
  .addArgument(new Argument('[valueTypeKey]').argOptional());

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const [index, subindex, value, valueTypeKey] = program.processedArgs as [number, number, string, ParameterTypeValueKey];

client.whenReady().then(async () => {
  await client.request.download(deviceRef, index, subindex, value, valueTypeKey, requestTimeout, messageId);
}).finally(() => client.closeSockets());
