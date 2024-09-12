import { program } from 'commander';
import { client } from '../init-client';

program.parse();

const { deviceRef } = program.opts();

client.whenReady().then(async () => {
  await client.runVelocityProfile(deviceRef, {
    target: 1000,
    acceleration: 2000,
    deceleration: 2000,
  });
}).finally(() => client.closeSockets());
