'use strict';

const http = require('node:http');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        message: 'Hello from the Node.js demo app!',
        status: 'ok',
        service: 'nodejs-demo-app'
      }));
    }

    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'healthy' }));
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, '0.0.0.0', () => {
    console.log(`nodejs-demo-app listening on port ${port}`);
  });
}

module.exports = { createServer };
