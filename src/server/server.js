'use strict';

const hapi = require('hapi');
const JobService = require('./jobs');
const { host } = require('../config');

console.log('host:', host); // DEBUG
const server = new hapi.Server();
server.connection({ port: 5000, host , routes: { cors: true } });

server.route({ method: 'GET', path: '/jobs', handler: JobService.all });
server.route({ method: 'GET', path: '/search', handler: JobService.find });

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
