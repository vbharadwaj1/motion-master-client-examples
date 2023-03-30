require('dotenv').config()
Object.assign(global, { WebSocket: require('ws') });

import Long from "long";
import { createMotionMasterClient, ParameterValueType } from "motion-master-client";

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

export function longToNumber(value: ParameterValueType) {
  return Long.isLong(value) ? value.toNumber() : value;
}
