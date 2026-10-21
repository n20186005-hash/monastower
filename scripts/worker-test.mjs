import assert from 'node:assert/strict';
import worker from '../src/worker.ts';
let calls = 0;
const env = { ASSETS: { async fetch(/** @type {Request} */ request) { calls++; return new Response('asset', { status: new URL(request.url).pathname === '/missing/' ? 404 : 200 }); } } };
for (const origin of ['http://monastower.com', 'http://www.monastower.com', 'https://www.monastower.com']) {
  const response = await worker.fetch(new Request(origin + '/visit/?x=1'), env);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://monastower.com/visit/?x=1');
}
assert.equal(calls, 0);
const found = await worker.fetch(new Request('https://monastower.com/'), env);
assert.equal(found.status, 200);
const missing = await worker.fetch(new Request('https://monastower.com/missing/'), env);
assert.equal(missing.status, 404);
assert.equal(missing.headers.get('X-Robots-Tag'), 'noindex, follow');
assert.equal(await missing.text(), 'asset');
console.log('Worker: canonical redirects, ASSETS delegation, and preserved 404 passed.');

for (const path of ['/404.html', '/404', '/404/']) {
  for (const method of ['GET', 'HEAD']) {
    for (const query of ['', '?test=1']) {
      const result = await worker.fetch(new Request('https://monastower.com' + path + query, { method }), env);
      assert.equal(result.status, 404);
      assert.equal(result.headers.get('location'), null);
      assert.equal(result.headers.get('x-robots-tag'), 'noindex, follow');
      assert.equal(await result.text(), method === 'HEAD' ? '' : 'asset');
    }
  }
}
const redirectingAssets = { ASSETS: { async fetch(/** @type {Request} */ request) {
  return new URL(request.url).pathname === '/404.html'
    ? Response.redirect('https://monastower.com/404/', 307)
    : new Response('<h1>Page not found</h1>', { headers: { 'Content-Type': 'text/html' } });
} } };
const alias = await worker.fetch(new Request('https://monastower.com/404?x=1'), redirectingAssets);
assert.equal(alias.status, 404);
assert.match(await alias.text(), /Page not found/);
console.log('Explicit 404 aliases: GET/HEAD/query and asset-redirect content passed.');
for (const origin of ['http://monastower.com','http://www.monastower.com','https://www.monastower.com']) {
 for (const path of ['/404','/404/','/404.html']) {
  for (const method of ['GET','HEAD']) {
   const result=await worker.fetch(new Request(origin+path+'?error=1',{method}),env);
   assert.equal(result.status,301);assert.equal(result.headers.get('location'),'https://monastower.com'+path+'?error=1');
  }
 }
}
console.log('Explicit error aliases retain canonical-host redirect priority and exact path/query for GET/HEAD.');
