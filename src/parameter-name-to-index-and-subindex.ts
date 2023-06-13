import { client } from './init-client';
import { mergeMap } from 'rxjs';

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceParameters({ devicePosition: 0, loadFromCache: true, sendProgress: false })),
).subscribe({
  next: (status) => {
    const obj = status.parameters.reduce((acc, parameter) => {
      acc[parameter.name] = [parameter.index, parameter.subindex]; // NOTE: duplicate names will be overwritten
      return acc;
    }, {} as { [key: string]: [number, number] });
    console.log(JSON.stringify(obj));
  },
  complete: () => client.closeSockets(),
});
