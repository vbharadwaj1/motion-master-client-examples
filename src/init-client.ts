require('dotenv').config();
import { program, Option } from 'commander';
Object.assign(globalThis, { WebSocket: require('ws') });

import { createMotionMasterClient } from "motion-master-client";

if (!process.env.MOTION_MASTER_HOSTNAME) {
  console.error('Error: MOTION_MASTER_HOSTNAME environment variable is not defined.');
  process.exit(1);
}

export const client = createMotionMasterClient(process.env.MOTION_MASTER_HOSTNAME);

export function logStatus(status: {
  deviceAddress?: number | null,
  success?: { message?: string | null, code?: number | null } | null,
  error?: { message?: string | null, code?: number | null } | null,
  warning?: { message?: string | null, code?: number | null } | null,
}): void {
  if (status.success) {
    console.info(`Request succeeded for device ${status.deviceAddress}: (${status.success.code}) ${status.success.message}`);
  } else if (status.warning) {
    console.warn(`Request warning for device ${status.deviceAddress}: (${status.warning.code}) ${status.warning.message}`);
  } else if (status.error) {
    console.error(`Request failed for device ${status.deviceAddress}: (${status.error.code}) ${status.error.message}`);
  }
}

program
  .addOption(new Option('-d, --device-ref <value>', 'position, address, or serial number')
    .default(0, '0 position as the first device in the chain')
    .argParser(parseDeviceRefArg));

export function parseDeviceRefArg(value: string) {
  const n = Number(value);
  return isNaN(n) ? value : n;
}
