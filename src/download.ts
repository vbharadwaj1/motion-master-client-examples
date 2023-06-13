import { client } from './init-client';

client.whenReady().then(async () => {
  await client.request.download(0, 0x20F2, 0, "motion-master-client-examples");
  const assignedName = await client.request.upload<string>(0, 0x20F2, 0);
  console.log(`0x20F2: Assigned name set to "${assignedName}"`);
  client.closeSockets();
});
