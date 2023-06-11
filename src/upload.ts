import { client } from './init-client';

client.whenReady().then(async () => {
  const value = await client.request.upload(0, 0x2030, 1);
  console.log(value);
  client.closeSockets();
});
