import { client } from './init-client';
import Long from 'long';

(async function () {
  await client.whenReady();

  const value = await client.request.upload<Long>(0, 0x2030, 1);
  console.log(value);
  console.log(value.toNumber());

  client.closeSockets();
})();
