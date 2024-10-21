import { program, Option } from 'commander';
import { EthernetDevice, isRxPdoIndex, isTxPdoIndex } from 'motion-master-client';

program
  .addOption(
    new Option('-b, --base-url <value>', 'specify the base URL (e.g., http://192.168.0.100:8080)')
      .default('http://192.168.0.100:8080', 'the default base URL, representing a single Ethernet device'),
  );

program.parse();

const { baseUrl } = program.opts();

const device = new EthernetDevice(baseUrl);

(async () => {
  // const parameters = await device.getCachedParameters();
  // console.log(parameters);

  // const statusword = await device.upload(0x6041, 0);
  // console.log(statusword);

  // const rxPdoEntries = await device.getCachedPdoEntries('rxPdoEntries', isRxPdoIndex);
  // console.log(rxPdoEntries);

  // const txPdoEntries = await device.getCachedPdoEntries('txPdoEntries', isTxPdoIndex);
  // console.log(txPdoEntries);

  const txPdoValues = await device.receivePdo();
  console.log(txPdoValues);
})();

console.log(device);
