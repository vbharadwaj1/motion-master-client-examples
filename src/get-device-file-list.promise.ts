import { program } from 'commander';
import { makeDeviceRefObj } from 'motion-master-client';
import { firstValueFrom, map } from 'rxjs';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.whenReady().then(async () => {
  const fileList = await firstValueFrom(
    client.request.getDeviceFileList(deviceRefObj, 3000).pipe(
      map((status) => status.fileList?.files ?? []),
    ),
  );
  console.log(fileList);
}).finally(() => client.closeSockets());
