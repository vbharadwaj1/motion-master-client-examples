import { MotionMasterMessage } from 'motion-master-client';
import { client } from './init-client';
import { delay } from 'rxjs';

// Power-cycle the devices to observe the system events.

client.monitor.systemEvent$.subscribe((status) => {
  switch (status.state) {
    case MotionMasterMessage.Status.SystemEvent.State.DEINITIALIZED:
      console.log('Motion Master has deinitialized.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.INITIALIZED:
      console.log('Motion Master has initialized.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.SLAVES_FOUND:
      console.log('Motion Master has found slaves.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.DEINITIALIZING:
      console.log('Motion Master is deinitializing.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.INITIALIZING:
      console.log('Motion Master is initializing.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.TERMINATING:
      console.log('Motion Master is terminating.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.WAITING_FOR_SLAVES:
      console.log('Motion Master is waiting for slaves.');
      break;
    case MotionMasterMessage.Status.SystemEvent.State.UNSPECIFIED:
    default:
      console.log('Unknown system event.');
      break;
  }
});

client.onceReady$.pipe(delay(60000)).subscribe({
  complete: () => client.closeSockets(),
});
