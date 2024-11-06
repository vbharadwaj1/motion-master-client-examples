import { Argument, program } from 'commander';
import { client, logStringified } from './init-client';
import { Cia402State, supportedDriveModesBits } from 'motion-master-client';
import { mergeMap, Subscription } from 'rxjs';
import { makeParameterId, MotionMasterMessage, makeDeviceRefObj, splitParameterId } from 'motion-master-client';
import { createObjectCsvWriter as createCsvWriter} from 'csv-writer';
import { PythonShell } from 'python-shell';
import { exec } from 'child_process';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import csvParser from 'csv-parser';


// Extract options from the command line arguments
program
  .option('--requestTimeout <number>', 'Request timeout in milliseconds', parseInt, 60000)
  .option('--messageId <string>', 'Message ID', '')
  .option('--refTorqueSensorType <number>', 'Reference torque sensor type', parseInt, 0)
  .option('--maxTorquemNm <number>', 'max Torque mNm', parseFloat, 0)
  .option('--parameterIds <string>', 'Comma-separated parameter IDs', '')
  .option('--sendProgress', 'Send progress updates', false)
  .option('--loadFromCache', 'Load from cache', false);

program.parse(process.argv);

const { requestTimeout = 60000, messageId, refTorqueSensorType, maxTorquemNm, parameterIds, sendProgress, loadFromCache } = program.opts();

// Define the device reference and create a device reference object
const deviceRef = 1;
const deviceRefObj = makeDeviceRefObj(deviceRef);

// Utility function to create a delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Subscription to handle monitoring data
let subscription: Subscription;

// CSV writer to record data for torque estimation
const csvWriter = createCsvWriter({
  path: 'data_recording_for_torque_estimation.csv',
  header: [
      { id: 'timestamp', title: 'TIMESTAMP' },
      { id: 'encoder1', title: 'ENCODER 1 TICKS' },
      { id: 'MotorVel', title: 'MOTOR VELOCITY mRPM' },
      { id: 'TorqueAct', title: 'TORQUE ACTUAL (%%)' },
      { id: 'RefTorque', title: 'Ref Torque [mNm]' },
      { id: 'Torsion', title: 'TORSION' },
  ]
});

// Handle graceful shutdown on SIGINT (Ctrl-C)
process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  client.request.transitionToCia402State(deviceRef, Cia402State.SWITCH_ON_DISABLED);
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

// Define the parameter IDs and their corresponding names for monitoring
const ids: [number, number, number][] = [
  [deviceRef, 0x20F0, 0], // Timestamp
  [deviceRef, 0x2111, 2], // Encoder 1 adjusted position
  [deviceRef, 0x2113, 3], // Motor velocity
  [deviceRef, 0x6077, 0], // Motor torque actual value
  [deviceRef, 0x2038, 1], // External scaled measurement
  [deviceRef, 0x2151, 0], // Torsion
];

// Create parameter names from IDs
const names = ids.map(([, index, subindex]) => makeParameterId(index, subindex));

// Subscribe to monitoring data and write to CSV
subscription = client.onceReady$.pipe(
  mergeMap(() => client.startMonitoring(ids, 1000)),
).subscribe((values) => {
  csvWriter.writeRecords([{ timestamp: values[0], encoder1: values[1],
                            MotorVel: values[2], TorqueAct: values[3], RefTorque : values[4], Torsion : values[5]
   }] );
});

let modeOfOperation = 3; // profile velocity mode
let targetVelocityArray = [500, 1000, 2000, 5000, 7500, 10000]; // mRpm
let time_of_one_revolution_ms = 0;
let number_of_rotation = 0.25;
let waitTime = 0;

client.whenReady().then(async () => {
  // Reset the targets for the device
  await client.request.resetTargets(deviceRef);

  // Download the mode of operation and initial target velocity
  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, modeOfOperation],
    [deviceRef, 0x60FF, 0, 0],
  ]);

  // Transition the device to the OPERATION_ENABLED state
  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

  // Iterate over the target velocities and apply them
  for (var targetVelocity of targetVelocityArray) {
    time_of_one_revolution_ms = (60 / (targetVelocity)) * 1000 * 1000;
    waitTime = time_of_one_revolution_ms * number_of_rotation;
    console.log(waitTime)
    // Set the target velocity
    await client.request.downloadMany([
        [deviceRef, 0x60FF, 0, targetVelocity]
    ]);

    // Wait for the specified time
    await delay(waitTime);

    // Set the target velocity to the negative value
    await client.request.downloadMany([
        [deviceRef, 0x60FF, 0, -targetVelocity]
    ]);

    // Wait for the specified time
    await delay(2 * waitTime);

    await client.request.downloadMany([
      [deviceRef, 0x60FF, 0, targetVelocity]
    ]);

    // Wait for the specified time
    await delay(waitTime);
  }

  // Set the target velocity to zero
  await client.request.downloadMany([
    [deviceRef, 0x60FF, 0, 0],
  ]);

  // Transition the device to the SWITCH_ON_DISABLED state
  await client.request.transitionToCia402State(deviceRef, Cia402State.SWITCH_ON_DISABLED);

  // Define the parameter IDs to be fetched
  let parameterIds = "0x2110:03, 0x6076:00 , 0x6091:01, 0x6091:02";

  // Split the parameter IDs and create the parameters array
  const parameters = parameterIds.split(',').reduce((arr, parameterId) => {
    const [index, subindex] = splitParameterId(parameterId.trim());
    arr.push({ index, subindex, loadFromCache });
    return arr;
  }, [] as MotionMasterMessage.Request.GetDeviceParameterValues.IParameter[]);

  // Fetch the device parameter values
  const status = await lastValueFrom(client.request.getDeviceParameterValues({ ...deviceRefObj, parameters, sendProgress }, requestTimeout, messageId));

  // Prepare arguments for the Python script
  let argument = ['0', '0'];
  if (status.parameterValues?.length) {
    let encoder_1_resolution = String(status.parameterValues[0]["uintValue"]);
    let ratedMotorTorquemNm = String(status.parameterValues[1]["uintValue"]);
    let motorRevolutions = String(status.parameterValues[2]["uintValue"]);
    let gearRevolution = String(status.parameterValues[3]["uintValue"]);
    argument = [encoder_1_resolution, ratedMotorTorquemNm, refTorqueSensorType, maxTorquemNm, motorRevolutions, gearRevolution];
  }

  // Define options for the Python script
  let options = {
    mode: 'text' as any,
    args: argument
  };

  // Unsubscribe from the subscription
  subscription?.unsubscribe();
  let result: string[] = [];
  try {
    // Run the Python script
    result = await PythonShell.run('data_fitting.py', options);
    console.log('Python script result:', result);
  } catch (error) {
    console.error('Promise rejected with error: ', error);
  }

  // Read the coefficients from the CSV file
  const coefficients: { coefficient: string }[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream('coefficients.csv')
      .pipe(csvParser(['coefficient']))
      .on('data', (row: { coefficient: string }) => {
        coefficients.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Download the coefficients to the device if enough coefficients are found
  if (coefficients.length >= 5) {
    await client.request.downloadMany([
      [deviceRef, 0x2150, 6, coefficients[1].coefficient],
      [deviceRef, 0x2150, 7, coefficients[2].coefficient],
      [deviceRef, 0x2150, 8, coefficients[3].coefficient],
      [deviceRef, 0x2150, 9, coefficients[4].coefficient],
      [deviceRef, 0x2150, 10, coefficients[5].coefficient],
    ]);
  } else {
    console.error('Not enough coefficients found in the CSV file.');
  }

}).finally(() => client.closeSockets());
