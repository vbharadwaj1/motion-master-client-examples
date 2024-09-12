import { program } from 'commander';
import { compile } from 'ejs';
import { client } from './init-client';
import { lastValueFrom } from 'rxjs';
import { isRxPdoIndex, isTxPdoIndex, makeDeviceRefObj } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();
const deviceRefObj = makeDeviceRefObj(deviceRef);

const template = compile(`#!/usr/bin/env bash
ethercat state PREOP
<%=lines%>
ethercat state OP
`);

client.whenReady().then(async () => {
  const deviceInfo = await lastValueFrom(client.request.getDeviceParameterInfo(deviceRefObj, 5000));
  const parameters = deviceInfo.parameters?.filter((p) => isRxPdoIndex(p.index!) || isTxPdoIndex(p.index!));

  const data: [number, number, number][] = [];
  for (const p of parameters!) {
    const value = await client.request.upload(deviceRef, p.index!, p.subindex!);
    data.push([p.index!, p.subindex!, value]);
  }

  const lines: string[] = [];

  let n = 0;
  for (let [index, subindex, value] of data) {
    if (subindex === 0) {
      lines.push(`ethercat download --position=${deviceRef} --type=uint8 ${index} ${subindex} 0`);
      n = value;
    } else {
      lines.push(`ethercat download --position=${deviceRef} --type=uint32 ${index} ${subindex} ${value}`);
      if (subindex === n) {
        lines.push(`ethercat download --position=${deviceRef} --type=uint8 ${index} 0 ${n}`);
      }
    }
  }

  console.log(template({ lines: lines.join('\n') }));
}).finally(() => client.closeSockets());
