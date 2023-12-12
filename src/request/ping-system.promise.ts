import { client } from "../init-client";

client.whenReady()
  .then(() => client.request.pingSystem())
  .finally(() => client.closeSockets());
