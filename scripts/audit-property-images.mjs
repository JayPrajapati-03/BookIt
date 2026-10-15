import fs from 'node:fs/promises';

const seedPath = new URL('../apps/api/src/seed/catalogue.data.ts', import.meta.url);
const text = await fs.readFile(seedPath, 'utf8');

const urls = [...text.matchAll(/url: '([^']+)'/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith('http'));

const results = [];

for (const url of urls) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/141 Safari/537.36',
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    const contentType = response.headers.get('content-type') ?? '';
    results.push({
      ok: response.ok && contentType.startsWith('image/'),
      status: response.status,
      contentType,
      url,
    });
  } catch (error) {
    results.push({ ok: false, status: 'ERR', contentType: error.message, url });
  }
}

const broken = results.filter((result) => !result.ok);
for (const result of broken) {
  console.log(`${result.status} ${result.contentType} ${result.url}`);
}

console.log(`checked=${results.length} broken=${broken.length}`);
process.exit(broken.length ? 1 : 0);
