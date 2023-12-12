import { Argument, program } from 'commander';
import { MotionMasterMessage, makeDeviceRefObj } from 'motion-master-client';
import { client, logStringified } from '../init-client';
import { firstValueFrom } from 'rxjs';

program.addArgument(
  new Argument('<state>', 'EtherCAT network state')
    .choices(Object.keys(MotionMasterMessage.Status.EthercatNetworkState.State))
    .argParser((value: any) => MotionMasterMessage.Status.EthercatNetworkState.State[value])
);

program.parse();

const { deviceRef, requestTimeout = 10000, messageId } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [state] = program.processedArgs as [MotionMasterMessage.Status.EthercatNetworkState.State];

client.whenReady().then(async () => {
  const status = await firstValueFrom(client.request.setEthercatNetworkState({ ...deviceRefObj, state }, requestTimeout, messageId));
  logStringified(status);
}).finally(() => client.closeSockets());
