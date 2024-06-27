import { program } from 'commander';
import { client } from './init-client';
import { makeDeviceRefObj } from 'motion-master-client';
import { mergeMap } from 'rxjs';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

client.onceReady$.pipe(
  mergeMap(() => client.request.getDeviceParameters({ ...deviceRefObj, loadFromCache: true, sendProgress: false })),
).subscribe({
  next: (status) => {
    const obj = status.parameters.reduce((acc, parameter) => {
      const name = parameter.group ? `${parameter.group}: ${parameter.name}` : parameter.name;
      acc[name] = [parameter.index, parameter.subindex];
      return acc;
    }, {} as { [key: string]: [number, number] });
    console.log(JSON.stringify(obj));
  },
  complete: () => client.closeSockets(),
});
