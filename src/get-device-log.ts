import { program } from 'commander';
import { firstValueFrom } from 'rxjs';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  const currLog = await firstValueFrom(client.request.getDecodedFile(deviceRef, 'logging_curr.log'));
  console.log(currLog);

  const prevLog = await firstValueFrom(client.request.getDecodedFile(deviceRef, 'logging_prev.log'));
  console.log(prevLog);

  client.closeSockets();
});
