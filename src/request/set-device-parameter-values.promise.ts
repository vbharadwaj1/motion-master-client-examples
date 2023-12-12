import { Argument, program } from 'commander';
import { MotionMasterMessage, ParameterTypeValue, makeDeviceRefObj, splitParameterId } from 'motion-master-client';
import { client, logStringifiedStatus } from '../init-client';
import { lastValueFrom } from 'rxjs';

program
  .addArgument(new Argument('<parameterIdsWithValuesAndTypes>', 'comma-separated list of parameter ids with values and types, e.g. 0x20F2:00=BELGRADE_stringValue,0x6072:00=2500_uintValue'));

program.parse();

const { deviceRef, requestTimeout = 30000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [parameterIdsWithValuesAndTypes] = program.processedArgs as [string];

const parameterValues = parameterIdsWithValuesAndTypes.split(',').reduce((arr, str) => {
  const [parameterIdWithValue, typeValue] = str.split('_');
  const [parameterId, value] = parameterIdWithValue.split('=');
  const [index, subindex] = splitParameterId(parameterId.trim());

  const valueObject: ParameterTypeValue = { [typeValue]: typeValue === 'stringValue' ? value : Number(value) };

  arr.push({ index, subindex, ...valueObject });
  return arr;
}, [] as MotionMasterMessage.Request.SetDeviceParameterValues.IParameterValue[]);

client.whenReady().then(async () => {
  const status = await lastValueFrom(client.request.setDeviceParameterValues({ ...deviceRefObj, parameterValues }, requestTimeout, messageId));
  logStringifiedStatus(status);
}).finally(() => client.closeSockets());
