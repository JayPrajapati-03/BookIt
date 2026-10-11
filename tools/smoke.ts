export { runSmokeTests } from '../apps/api/src/smoke.js';

if (process.argv[1]?.endsWith('smoke.ts') || process.argv[1]?.endsWith('smoke.js')) {
  import('../apps/api/src/smoke.js').then((m) => m.runSmokeTests());
}
