import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { mergeMap, map } from 'rxjs';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceFileList(deviceRefObj, 2000)),
  map((status) => status.fileList?.files ?? []),
).subscribe({
  next: console.log,
  complete: () => client.closeSockets(),
});
