import { Argument, program } from 'commander';
import { client, logStringified } from './init-client';
import { Cia402State } from 'motion-master-client';
import { mergeMap, Subscription } from 'rxjs';
import { makeParameterId, MotionMasterMessage, makeDeviceRefObj, splitParameterId } from 'motion-master-client';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { PythonShell } from 'python-shell';
import { exec } from 'child_process';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { readFileSync } from 'fs';

const { requestTimeout = 60000, messageId } = program.opts();
const deviceRef = 1;
const deviceRefObj = makeDeviceRefObj(deviceRef);
const [parameterIds, sendProgress, loadFromCache] = program.processedArgs as [string, boolean, boolean];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let subscription: Subscription;

const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
      { id: 'timestamp', title: 'TIMESTAMP' },
      { id: 'encoder1', title: 'ENCODER 1 TICKS' },
      { id: 'encoder2', title: 'ENCODER 2 TICKS' }
  ]
});

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  client.request.transitionToCia402State(deviceRef, Cia402State.SWITCH_ON_DISABLED);
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

const ids: [number, number, number][] = [
  [deviceRef, 0x20F0, 0], // Timestamp
  [deviceRef, 0x2111, 2], // Encoder 1
  [deviceRef, 0x2113, 2], // Encoder 2
];

const names = ids.map(([, index, subindex]) => makeParameterId(index, subindex));

subscription = client.onceReady$.pipe(
  mergeMap(() => client.startMonitoring(ids, 1000)),
).subscribe((values) => {
  csvWriter.writeRecords([{ timestamp: values[0], encoder1: values[1], encoder2 : values[2] }] );
});

let modeOfOperation = 3; // profile velocity mode
let targetVelocity = 2000; // mRpm
let time_of_one_revolution_s = (60 / (Math.abs(targetVelocity)) * 1000 * 1000);
let number_of_rotation = 1.5;
let waitTime = time_of_one_revolution_s * number_of_rotation;

client.whenReady().then(async () => {
  await client.request.resetTargets(deviceRef);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, modeOfOperation],
    [deviceRef, 0x60FF, 0, targetVelocity],
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

  await delay(waitTime);

  await client.request.downloadMany([
    [deviceRef, 0x60FF, 0, 0],
  ]);


  await client.request.transitionToCia402State(deviceRef, Cia402State.SWITCH_ON_DISABLED);

  let parameterIds = "0x2110:03, 0x2112:03, 0x6091:01";

  const parameters = parameterIds.split(',').reduce((arr, parameterId) => {
    const [index, subindex] = splitParameterId(parameterId.trim());
    arr.push({ index, subindex, loadFromCache });
    return arr;
  }, [] as MotionMasterMessage.Request.GetDeviceParameterValues.IParameter[]);

  const status = await lastValueFrom(client.request.getDeviceParameterValues({ ...deviceRefObj, parameters, sendProgress }, requestTimeout, messageId));

  let argument = ['0', '0', '0'];
  if (status.parameterValues?.length) {
    let encoder_1_resolution = String(status.parameterValues[0]["uintValue"]);
    let encoder_2_resolution = String(status.parameterValues[1]["uintValue"]);
    let gearRatio = String(status.parameterValues[2]["uintValue"]);

    argument = [encoder_1_resolution, encoder_2_resolution, gearRatio]
  }

  let options = {
    mode: 'text' as any,
    args: argument
  };

  subscription?.unsubscribe();
  await PythonShell.run('get_encoder_difference_table.py', options).then((result) => {
    console.log('Promise resolved with value: ', result);
  })
  .catch((error) => {
    console.error('Promise rejected with error: ', error);
  });

// const [name, path, overwrite] = program.processedArgs as [string, string, boolean];

let name = 'encoder_calibration_table.bin';
let path = "encoder_calibration_table.bin";
let overwrite = true;

const content = Buffer.from(readFileSync(path, { encoding: 'binary' }), 'binary');

const status_write = await firstValueFrom(client.request.setDeviceFile({ ...deviceRefObj, name, content, overwrite }, requestTimeout, messageId));
logStringified(status_write);


}).finally(() => client.closeSockets());

// At the end of your TypeScript script
