import { client } from './init-client';
import { bufferCount, distinctUntilChanged, filter, map, mergeMap, Subscription, } from 'rxjs';

let subscription: Subscription;

const samplingInterval = 250000; // microseconds
const resolution = 4096; // ticks
const ticksPerChar = 4096 / 26;
const samplingSize = 6;

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C).\nStopping monitoring and closing sockets.");
  subscription?.unsubscribe();
  client.closeSockets();
  process.exit(0);
});

subscription = client.onceReady$.pipe(
  mergeMap(() => client.startMonitoringValue([0, 0x6064, 0], samplingInterval)),
  bufferCount(samplingSize),
  filter((values) => {
    const standardDeviation = calculateStandardDeviation(values);
    return standardDeviation < ticksPerChar;
  }),
  map((values) => calculateCharPosition(values)),
  distinctUntilChanged(),
).subscribe((charPosition) => {
  console.log(String.fromCharCode(65 + charPosition));
});

function calculateZScore(dataPoint: number, mean: number, standardDeviation: number) {
  return (dataPoint - mean) / standardDeviation;
}

function calculateStandardDeviation(data: number[]) {
  const mean = calculateMean(data);
  const squaredDifferences = data.map((value) => Math.pow(value - mean, 2));
  const averageSquaredDifference = calculateMean(squaredDifferences);
  const standardDeviation = Math.sqrt(averageSquaredDifference);
  return standardDeviation;
}

function calculateMean(data: number[]) {
  const sum = data.reduce((accumulator, value) => accumulator + value, 0);
  const mean = sum / data.length;
  return mean;
}

function calculateCharPosition(data: number[]) {
  const sum = data.map(v => Math.abs(v)).reduce((p, v) => (p + v), 0);
  const avg = sum / data.length;
  const pos = avg % resolution;
  const val = pos / ticksPerChar;
  return Math.floor(val);
}
