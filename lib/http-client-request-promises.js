'use strict';

const http = require('http');

const method = (process.argv[2] || 'get').toUpperCase();

const data = JSON.stringify({
  key: 'value',
});

const headers = {
  'Content-Type': 'application/json',
  'Content-Length': data.length,
};

const sendData = ['POST', 'PATCH'].some(e => e === method);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/upload',
  method,
};

if (sendData) {
  options.headers = headers;
}

new Promise((resolve, reject) => {

  //whatever we get back from the server build it ip in JSON
  //and dump it to the console
  const request = http.request(options, (response) => {
    let data = '';
    response.setEncoding('utf8');
    response.on('error', reject);
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      resolve(data);
    });
  });

  request.on('error', reject);

  if (sendData) {
    request.write(data);
  }

  request.end();
}).then(console.log).catch(console.error);
