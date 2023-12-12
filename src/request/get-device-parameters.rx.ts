import { Argument, program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { client, logStringified } from '../init-client';
import { mergeMap } from 'rxjs';

program
  .addArgument(new Argument('[sendProgress]', 'send progress while retrieving the parameter values from the device')
    .argOptional()
    .default(false)
    .choices(['true', 'false'])
    .argParser((value) => value.toLowerCase() === 'true'))
  .addArgument(new Argument('[loadFromCache]', 'load parameter values from the Motion Master cache')
    .argOptional()
    .default(false)
    .choices(['true', 'false'])
    .argParser((value) => value.toLowerCase() === 'true'));

program.parse();

const { deviceRef, requestTimeout = 60000 } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [sendProgress, loadFromCache] = program.processedArgs as [boolean, boolean];

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceParameters({ ...deviceRefObj, loadFromCache, sendProgress }, requestTimeout))
).subscribe({
  next: logStringified,
  complete: () => client.closeSockets(),
});
