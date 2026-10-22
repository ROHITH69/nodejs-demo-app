'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/server');

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  }
}

test('GET / returns the app greeting', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/json/);
    const body = await response.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'nodejs-demo-app');
  });
});

test('GET /health returns healthy status', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'healthy' });
  });
});

test('unknown paths return 404', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/missing`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Not found' });
  });
});
