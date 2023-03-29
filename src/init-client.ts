require('dotenv').config()
Object.assign(global, { WebSocket: require('ws') });

import { createMotionMasterClient } from "motion-master-client";

if (!process.env.MOTION_MASTER_HOSTNAME) {
  console.error('Error: MOTION_MASTER_HOSTNAME environment variable is not defined.');
  process.exit(1);
}

export const client = createMotionMasterClient(process.env.MOTION_MASTER_HOSTNAME);
