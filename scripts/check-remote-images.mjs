import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaFile = path.join(root, 'src/data/media.ts');
const mediaSource = await readFile(mediaFile, 'utf8');
const urls = [...new Set([...mediaSource.matchAll(/src:\s*'([^']+)'/g)].map((match) => match[1]))];

if (urls.length === 0) {
  console.error('No remote image URLs found in src/data/media.ts.');
  process.exit(1);
}

async function probe(url) {
  const headers = { 'User-Agent': 'City Advisor Istanbul image checker' };
  let response = await fetch(url, { method: 'HEAD', headers, redirect: 'follow' });

  if (response.status === 405 || response.status === 403 || !response.headers.get('content-type')) {
    response = await fetch(url, { method: 'GET', headers: { ...headers, Range: 'bytes=0-1023' }, redirect: 'follow' });
  }

  const contentType = response.headers.get('content-type') ?? '';
  return {
    ok: response.ok && contentType.toLowerCase().startsWith('image/'),
    status: response.status,
    contentType,
  };
}

const invalid = [];

await Promise.all(urls.map(async (url) => {
  try {
    const result = await probe(url);
    if (!result.ok) {
      invalid.push({ url, reason: `HTTP ${result.status}, Content-Type: ${result.contentType || 'missing'}` });
    }
  } catch (error) {
    invalid.push({ url, reason: error instanceof Error ? error.message : String(error) });
  }
}));

if (invalid.length > 0) {
  console.error('Invalid remote image URLs found:');
  for (const item of invalid) console.error(`- ${item.url}\n  ${item.reason}`);
  process.exit(1);
}

console.log(`Validated ${urls.length} remote image URL${urls.length === 1 ? '' : 's'}.`);
