import { program } from 'commander';
import { client } from '../init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  await client.runVelocityProfile(deviceRef, {
    acceleration: 2000,
    amplitude: 1000,
    deceleration: 2000,
  });
}).finally(() => client.closeSockets());
