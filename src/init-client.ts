require('dotenv').config()
Object.assign(global, { WebSocket: require('ws') });

import { createMotionMasterClient } from "motion-master-client";

if (!process.env.MOTION_MASTER_HOSTNAME) {
  console.error('Error: MOTION_MASTER_HOSTNAME environment variable is not defined.');
  process.exit(1);
}

export const client = createMotionMasterClient(process.env.MOTION_MASTER_HOSTNAME);

export function logStatus(status: {
  success?: { message?: string | null, code?: number | null } | null,
  error?: { message?: string | null, code?: number | null } | null,
  warning?: { message?: string | null, code?: number | null } | null,
}, type: string, deviceId?: string): void {
  if (status.success) {
    console.info(`${type} succeeded for device ${deviceId}: (${status.success.code}) ${status.success.message}`);
  } else if (status.warning) {
    console.warn(`${type} warning for device ${deviceId}: (${status.warning.code}) ${status.warning.message}`);
  } else if (status.error) {
    console.error(`${type} failed for device ${deviceId}: (${status.error.code}) ${status.error.message}`);
  }
}
