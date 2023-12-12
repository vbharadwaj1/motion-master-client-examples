import { Argument, program } from 'commander';
import { client } from '../init-client';
import { firstValueFrom } from 'rxjs';

program.addArgument(new Argument('<name>', 'file name, e.g. config.csv'));

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const [name] = program.processedArgs as [string];

client.whenReady().then(async () => {
  const content = await firstValueFrom(client.request.getDecodedFile(deviceRef, name, requestTimeout, messageId));
  console.log(content);
}).finally(() => client.closeSockets());
