import { program } from 'commander';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  const dataMonitoring = client.createDataMonitoring([
    [deviceRef, 0x20F0, 0],
    [deviceRef, 0x6077, 0],
  ], 1);

  dataMonitoring.start().subscribe();

  try {
    await client.request.download(deviceRef, 0x2014, 1, 10); // Torque window: Value
    await client.runTorqueProfile(1, {
      amplitude: 30,
      holdingDuration: 1000,
      torqueSlope: 10,
      targetReachedTimeout: 5000,
    });
  } finally {
    dataMonitoring.stop();
    console.log(dataMonitoring.csv);
  }
}).finally(() => client.closeSockets());
