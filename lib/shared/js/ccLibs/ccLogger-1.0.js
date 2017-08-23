/**
 * @fileoverview CCLogger Class
 * 
 * Wraps console logging in safer function calls.  This should prevent
 * errors when the console object does not exist.  This also types
 * the messages so they show up (as possible) as info, warn, and error
 * messages.
 * 
 * Usage:
 * 
 * 1) Include in the proper require.js main module with the following
 * line:
 * 
 * ccLogger: '/shared/js/ccLibs/ccLogger-1.0'
 * 
 * 2) include in the module as follows:
 * 
 * define(
 *   [... 'ccLogger' ...]
 *   function( ... log ...)
 * )
 * 
 * 3) invoke as follows:
 *  log.info("Your message here.")
 *  log.info("Your message here.", optionalObj)
 *  log.warn("Your message here.")
 *  log.warn("Your message here.", optionalObj)
 *  log.error("Your message here.")
 *  log.error("Your message here.", optionalObj)
 * 
 */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'ccLogger',

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  // none

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  [],function () {

    "use strict";

    /**
     * Creates a logger object.
     * @private
     * @name CCLogger
     * @class CCLogger
     */
    function CCLogger() {
    }

    /**
     * Info logging method.  Ensures the console exists before
     * logging.
     * @param {Object} Message or object to log.
     */
    CCLogger.prototype.info = function (message, pObject) {
      if (typeof console !== 'undefined') {
        if (pObject !== undefined && pObject !== null) {
          console.info("(INFO) " + message, pObject);
        } else {
          console.info("(INFO) " + message);
        }
      }
    };

    /**
     * Logs a debug statement to the browser console.
     * @param {Object} message messages to be logged
     */
    CCLogger.prototype.debug = function (message, pObject) {
      if (typeof console !== 'undefined') {
        if (!console.debug && typeof console.log !== 'undefined') {
          console.debug = console.log;
        }
        if (pObject !== 'undefined' && pObject !== null) {
          console.debug("(DEBUG) " + message, pObject);
        } else {
          console.debug("(DEBUG) " + message);
        }
      }
    };

    /**
     * Warning logging method.  Ensures the console exists before
     * logging.
     * @param {Object} Message or object to log.
     */
    CCLogger.prototype.warn = function (message, pObject) {
      if (typeof console !== 'undefined') {
        if (pObject !== undefined && pObject !== null) {
          console.warn("(WARN) " + message, pObject);
        } else {
          console.warn("(WARN) " + message);
        }
      }
    };

    /**
     * Error logging method.  Ensures the console exists before
     * logging.
     * @param {Object} Message or object to log.
     */
    CCLogger.prototype.error = function (message, pObject) {
      if (typeof console !== 'undefined') {
        if (pObject !== undefined && pObject !== null) {
          console.error("(ERROR) " + message, pObject);
        } else {
          console.error("(ERROR) " + message);
        }
      }
    };

    return new CCLogger();
  }
);

