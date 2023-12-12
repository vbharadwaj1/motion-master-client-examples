import { mergeMap } from "rxjs";
import { client } from "../init-client";

client.onceReady$.pipe(
  mergeMap(() => client.request.pingSystem())
).subscribe({
  complete: () => client.closeSockets(),
});
