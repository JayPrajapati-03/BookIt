export { runBenchmark } from '../../apps/api/src/benchmark.js';

if (process.argv[1]?.endsWith('benchmark.ts') || process.argv[1]?.endsWith('benchmark.js')) {
  import('../../apps/api/src/benchmark.js').then((m) => m.runBenchmark());
}
