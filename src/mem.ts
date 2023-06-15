import { program } from 'commander';
import { client } from './init-client';
import { bufferCount, distinctUntilChanged, filter, lastValueFrom, map, mergeMap, Subscription, } from 'rxjs';
import { Cia402State, resolveAfter } from 'motion-master-client';

program.parse();

const { deviceRef } = program.opts();

let subscription: Subscription;

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

const samplingInterval = 250000; // microseconds
const resolution = 524288; // ticks
const ticksPerChar = Math.round(resolution / 26);
const standardDeviationMargin = ticksPerChar / 4;
const samplingSize = 6;

subscription = client.onceReady$.pipe(
  mergeMap(() => client.startMonitoringValue([deviceRef, 0x6064, 0], samplingInterval)),
  bufferCount(samplingSize),
  filter((values) => {
    const standardDeviation = calculateStandardDeviation(values);
    return standardDeviation < standardDeviationMargin;
  }),
  map((values) => calculateCharPosition(values)),
  distinctUntilChanged(),
).subscribe((charPosition) => {
  console.log(String.fromCharCode(65 + charPosition));
});

function calculateStandardDeviation(data: number[]): number {
  const mean = calculateMean(data);
  const squaredDifferences = data.map((value) => Math.pow(value - mean, 2));
  const averageSquaredDifference = calculateMean(squaredDifferences);
  const standardDeviation = Math.sqrt(averageSquaredDifference);
  return standardDeviation;
}

function calculateMean(data: number[]): number {
  const sum = data.reduce((accumulator, value) => accumulator + value, 0);
  const mean = sum / data.length;
  return mean;
}

function calculateCharPosition(data: number[]): number {
  const sum = data.map(v => Math.abs(v)).reduce((p, v) => (p + v), 0);
  const avg = sum / data.length;
  const pos = avg % resolution;
  const val = pos / ticksPerChar;
  return Math.floor(val);
}

async function say(message: string): Promise<void> {
  const chars = message.toUpperCase().split('');
  const positionActualValue = await client.request.upload(deviceRef, 0x6064, 0);
  const refPoint = positionActualValue - (positionActualValue % resolution);
  const charToPositionMap = createCharToPositionMap(refPoint);

  await client.request.downloadMany([
    [deviceRef, 0x6060, 0, 1], // profile position mode
    [deviceRef, 0x6067, 0, 250], // position window
    [deviceRef, 0x607A, 0, positionActualValue], // target position
    [deviceRef, 0x6081, 0, 10000], // profile velocity
    [deviceRef, 0x6083, 0, 10000], // profile acceleration
    [deviceRef, 0x6084, 0, 10000], // profile deceleration
  ]);

  await client.request.transitionToCia402State(deviceRef, Cia402State.OPERATION_ENABLED);

  for (const c of chars) {
    await client.request.download(deviceRef, 0x607A, 0, charToPositionMap[c]);
    await client.request.applySetPoint(deviceRef);
    await resolveAfter(50);
    await client.whenTargetReached(deviceRef);
    await resolveAfter(3000);
  }

  return;
}

function createCharToPositionMap(refPoint: number = 0): { [char: string]: number } {
  const val = Math.round(ticksPerChar / 2);
  const obj: { [char: string]: number } = {};
  for (let i = 0; i < 26; i++) {
    obj[String.fromCharCode(65 + i)] = i * ticksPerChar + val + refPoint;
  }
  return obj;
}

say('RUA').then(async () => {
  await client.request.quickStop(deviceRef);
  client.closeSockets()
});
