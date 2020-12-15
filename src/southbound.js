'use strict';

const express = require('express');
const config = require('./config');
const iotAgentLib = require('iotagent-node-lib');

let southboundServer = null;

function initSouthbound(callback) {
  // Create a new express server and start listening for incoming device measurements
  southboundServer = express();
  southboundServer.get(config.get('http.path'), processDeviceMeasurement);
  southboundServer.listen(
    config.get('http.port'),
    config.get('http.host'),
    callback,
  );
}

function processDeviceMeasurement(req, res) {
  iotAgentLib.retrieveDevice(
    req.query[config.get('http.idParameter')],
    req.query[config.get('http.apikeyParameter')],
    function (error, device) {
      if (error) {
        return res.status(404).json(error);
      }
      // Parse measurement and update entity
      let measurement = parseMeasurement(req.query, device);
      iotAgentLib.update(
        device.name,
        device.type,
        '',
        measurement,
        device,
        function (error) {
          if (error) {
            res.status(500).json({
              message: error,
            });
          } else {
            res.status(200).json({
              message: 'Device successfully updated',
            });
          }
        },
      );
    },
  );
}

function parseMeasurement(query, device) {
  function findConfiguredAttribute(param) {
    for (let attrib of device.active) {
      if (attrib.object_id === param) {
        return attrib;
      }
    }
    return null;
  }
  function createAttribute(param) {
    let attribute = findConfiguredAttribute(param);
    if (attribute === null) {
      return null;
    }
    return {
      name: attribute.name,
      value: query[param],
      type: attribute.type,
    };
  }

  // Remove id and apikey parameter from query to prevent accidental publishment to the CB
  delete query[config.get('http.idParameter')];
  delete query[config.get('http.apikeyParameter')];

  // Parse the query string by iterating over all keys and mapping them to an NGSI attribute
  return Object.keys(query)
    .map(createAttribute)
    .filter((a) => a !== null);
}

module.exports = {
  initSouthbound,
};
