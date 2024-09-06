import { program } from 'commander';
import { client } from '../init-client';

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
      acceleration: 2000,
      amplitude: 1000,
      deceleration: 2000,
      holdingDuration: 1000,
      skipQuickStop: false,
      targetReachedTimeout: 5000,
      window: 10,
      windowTime: 5,
    });
    console.log(dataMonitoring.csv);
  } finally {
    dataMonitoring.stop();
  }
}).finally(() => client.closeSockets());
