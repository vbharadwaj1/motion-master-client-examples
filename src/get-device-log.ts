import { client } from './init-client';
import { firstValueFrom } from 'rxjs';

client.whenReady().then(async () => {
  const currLog = await firstValueFrom(client.request.getDecodedFile(0, 'logging_curr.log'));
  console.log(currLog);

  const prevLog = await firstValueFrom(client.request.getDecodedFile(0, 'logging_prev.log'));
  console.log(prevLog);

  client.closeSockets();
});
