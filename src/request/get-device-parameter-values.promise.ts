import { Argument, program } from 'commander';
import { MotionMasterMessage, makeDeviceRefObj, splitParameterId } from 'motion-master-client';
import { client, logStringified } from '../init-client';
import { lastValueFrom } from 'rxjs';

program
  .addArgument(new Argument('<parameterIds>', 'comma-separated list of parameter ids, e.g. "0x2030:01,0x2110:0C"'))
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

const { deviceRef, requestTimeout = 30000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [parameterIds, sendProgress, loadFromCache] = program.processedArgs as [string, boolean, boolean];

const parameters = parameterIds.split(',').reduce((arr, parameterId) => {
  const [index, subindex] = splitParameterId(parameterId.trim());
  arr.push({ index, subindex, loadFromCache });
  return arr;
}, [] as MotionMasterMessage.Request.GetDeviceParameterValues.IParameter[]);

client.whenReady().then(async () => {
  const status = await lastValueFrom(client.request.getDeviceParameterValues({ ...deviceRefObj, parameters, sendProgress }, requestTimeout, messageId));
  logStringified(status);
}).finally(() => client.closeSockets());
