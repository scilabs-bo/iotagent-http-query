'use strict';

const convict = require('convict');
const convictFormatWithValidator = require('convict-format-with-validator');

convict.addFormats(convictFormatWithValidator);

/**
 * Based on https://github.com/telefonicaid/iotagent-ul/blob/master/config.js
 */
let config = convict({
  http: {
    host: {
      doc:
        'South host where the transport binding for HTTP will be listening to device measurements.',
      format: String,
      default: 'localhost',
      env: 'HTTP_SOUTH_HOST',
    },
    port: {
      doc:
        'South port where the transport binding for HTTP will be listening to device measurements.',
      format: 'port',
      default: 8080,
      env: 'HTTP_SOUTH_PORT',
    },
    path: {
      doc:
        'South path where the transport binding for HTTP will be listening to device measurements',
      format: String,
      default: '/wunderground',
      env: 'HTTP_SOUTH_PATH',
    },
    idParameter: {
      doc: 'South query parameter containing the device_id',
      format: String,
      default: 'ID',
      env: 'HTTP_SOUTH_ID_PARAMETER',
    },
    apikeyParameter: {
      doc: 'South query parameter containing the service apikey',
      format: String,
      default: 'PASSWORD',
      env: 'HTTP_SOUTH_APIKEY_PARAMETER',
    },
  },
  /**
   * The IOTA configuration section for the underlying library.
   * This section does only include a baseline configuration. This configuration is overwritten by the environment variables in the underlying library.
   */
  iota: {
    logLevel: {
      doc:
        'Configures the log level. Appropriate values are: FATAL, ERROR, INFO, WARN and DEBUG.',
      format: ['FATAL', 'ERROR', 'INFO', 'WARN', 'DEBUG'],
      default: 'INFO',
      env: 'IOTA_LOG_LEVEL',
    },
    timestamp: {
      doc:
        'When this flag is active, the IoTAgent will add the TimeInstant attribute to every entity created, as well as a TimeInstant metadata to each attribute, with the current timestamp.',
      format: Boolean,
      default: false,
      env: 'IOTA_TIMESTAMP',
    },
    contextBroker: {
      host: {
        doc: 'Host where the Context Broker is located.',
        format: String,
        default: 'localhost',
        env: 'IOTA_CB_HOST',
      },
      port: {
        doc: 'Port where the Context Broker is listening.',
        format: 'port',
        default: 1026,
        env: 'IOTA_CB_PORT',
      },
    },
    server: {
      port: {
        doc:
          'Port where the IoT Agent will be listening for NGSI and Provisioning requests.',
        format: 'port',
        default: 4041,
        env: 'IOTA_NORTH_PORT',
      },
    },
    deviceRegistry: {
      type: {
        doc:
          'Defines the configuration for the Device Registry, where all information about devices and configuration groups will be stored. There are currently just two types of registries allowed',
        format: ['mongodb', 'memory'],
        default: 'mongodb',
        env: 'IOTA_REGISTRY_TYPE',
      },
    },
    mongodb: {
      host: {
        doc:
          'Host where MongoDB is located. If the MongoDB used is a replicaSet, this property will contain a comma-separated list of the instance names or IPs.',
        format: String,
        default: 'localhost',
        env: 'IOTA_MONGO_HOST',
      },
      port: {
        doc:
          'Port where MongoDB is listening. In the case of a replicaSet, all the instances are supposed to be listening in the same port.',
        format: 'port',
        default: '27017',
        env: 'IOTA_MONGO_PORT',
      },
      db: {
        doc:
          'Name of the Mongo database that will be created to store IoT Agent data.',
        format: String,
        default: 'iotagentwu',
        env: 'IOTA_MONGO_DB',
      },
    },
    types: {
      doc: 'Types array for static configuration of services',
      format: Object,
      default: {},
    },
    providerUrl: {
      doc:
        'URL Where the IoT Agent Will listen for incoming updateContext and queryContext requests (for commands and passive attributes). This URL will be sent in the Context Registration requests.',
      format: 'url',
      default: 'http://localhost:4041',
      env: 'IOTA_PROVIDER_URL',
    },
    deviceRegistrationDuration: {
      doc: 'Default maximum expire date for device registrations.',
      format: String,
      default: 'P20Y',
    },
    service: {
      doc: 'Default service for devices without device group',
      format: String,
      default: 'openiot',
      env: 'IOTA_SERVICE',
    },
    subservice: {
      doc: 'Default subservice for devices without device group',
      format: String,
      default: '/',
      env: 'IOTA_SUBSERVICE',
    },
    defaultExpressionLanguage: {
      doc: 'Default expression language',
      format: ['legacy', 'jexl'],
      default: 'legacy',
      env: 'IOTA_DEFAULT_EXPRESSION_LANGUAGE',
    },
  },
});

config.validate({ allowed: 'strict' });

module.exports = config;
