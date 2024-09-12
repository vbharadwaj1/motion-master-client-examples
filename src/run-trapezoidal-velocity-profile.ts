import { program } from 'commander';
import { client } from './init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  const dataMonitoring = client.createDataMonitoring([
    [deviceRef, 0x20F0, 0], // Timestamp
    [deviceRef, 0x606B, 0], // Velocity demand value
    [deviceRef, 0x606C, 0], // Velocity actual value
    [deviceRef, 0x60FF, 0], // Target velocity
  ], 1);

  dataMonitoring.start().subscribe();

  try {
    await client.runVelocityProfile(deviceRef, {
      acceleration: 1000,
      target: 1000,
      deceleration: 1000,
      holdingDuration: 2000,
      skipQuickStop: true,
      targetReachTimeout: 10000,
      window: 10,
      windowTime: 5,
    });

    await client.runVelocityProfile(deviceRef, {
      acceleration: 500,
      target: 0,
      deceleration: 500,
      holdingDuration: 500,
      skipQuickStop: true,
      targetReachTimeout: 10000,
      window: 10,
      windowTime: 5,
    });

    await client.request.quickStop(deviceRef);

    console.log(dataMonitoring.csv);
  } finally {
    dataMonitoring.stop();
  }
}).finally(() => client.closeSockets());
