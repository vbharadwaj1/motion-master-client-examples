import { client } from './init-client';

client.whenReady().then(async () => {
  try {
    await client.request.quickStop(0);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  } finally {
    client.closeSockets();
  }
});
