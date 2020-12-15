'use strict';

const iotAgentLib = require('iotagent-node-lib');
const config = require('./config');
const { initSouthbound } = require('./southbound');

iotAgentLib.addUpdateMiddleware(
  iotAgentLib.dataPlugins.expressionTransformation.update,
);

// The IOTA will be configured using environment variables
iotAgentLib.activate(config.get('iota'), function (error) {
  if (error) {
    console.error(error);
    console.error('There was an error activating the IOTA');
    process.exit(1);
  }

  initSouthbound();
});
