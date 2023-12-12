import { Argument, program } from 'commander';
import { MotionMasterMessage, makeDeviceRefObj } from 'motion-master-client';
import { client, logStringifiedStatus } from '../init-client';
import { firstValueFrom } from 'rxjs';

program.addArgument(
  new Argument('<state>', 'EtherCAT network state')
    .choices(Object.keys(MotionMasterMessage.Status.EthercatNetworkState.State))
    .argParser((value: any) => MotionMasterMessage.Status.EthercatNetworkState.State[value])
);

program.parse();

const { deviceRef, requestTimeout = 10000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [state] = program.processedArgs;

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.setEthercatNetworkState({ ...deviceRefObj, state }, requestTimeout, messageId));
  logStringifiedStatus(status);
}).finally(() => client.closeSockets());
