import { Argument, program } from 'commander';
import { client } from '../init-client';
import { mergeMap } from 'rxjs';

program.addArgument(new Argument('<name>', 'file name, e.g. config.csv'));

program.parse();

const { deviceRef, requestTimeout = 5000, messageId } = program.opts();
const [name] = program.processedArgs as [string];

client.onceReady$.pipe(
  mergeMap(() => client.request.getDecodedFile(deviceRef, name, requestTimeout, messageId)),
).subscribe({
  next: console.log,
  complete: () => client.closeSockets(),
});
