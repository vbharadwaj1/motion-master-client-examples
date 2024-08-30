import { program } from 'commander';
import { client } from './init-client';
import { DataMonitoring } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  const dataMonitoring = new DataMonitoring(client);

  dataMonitoring.start([
    [deviceRef, 0x20F0, 0],
    [deviceRef, 0x6077, 0],
  ], 1, {
    topic: 'run-torque-profile',
    bufferSize: 1,
    collect: true,
    distinct: false,
  }).subscribe();

  try {
    await client.runTorqueProfile(1, {
      amplitude: 30,
      holdingDuration: 500,
      torqueSlope: 10,
      targetReachedTimeout: 5000,
      targetWindow: 0,
    });
  } finally {
    dataMonitoring.stop();
    console.log(dataMonitoring.csv);
  }
}).finally(() => client.closeSockets());
