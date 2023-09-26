'use strict';

/**
 * @summary
 * This is the configuration file for the applicaiton logger
 * It debugs messages to the console and logs error to a file in the logs/
 * @author Eric Kojo Abbey  <abbeykojoeric@gmail.com>
 */

import debug from 'debug';
import * as log4js from 'log4js';

// application debugger
export const appDebugger = debug('app');

/**
 * Configure logger for the application
 */
export const getLogger = () => {
  log4js.configure({
    appenders: {
      errors: {
        type: 'file',
        filename: './logs/app.log',
        maxLogSize: 10485760,
        backups: 3,
        compress: true,
      },
    },
    categories: {
      default: { appenders: ['errors'], level: 'error' },
    },
  });

  return log4js.getLogger();
};
