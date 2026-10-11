export { seedCatalogue } from '../../apps/api/src/seed/seed.js';

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  import('../../apps/api/src/seed/seed.js').then((m) => m.seedCatalogue());
}
