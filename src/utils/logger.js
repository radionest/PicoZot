/**
 * PicoZot - Zotero plugin for PICO analysis and literature review
 * 
 * Logging utilities
 */

// Log levels
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Log level priorities (higher number = higher priority)
const LOG_LEVEL_PRIORITIES = {
  [LOG_LEVELS.DEBUG]: 0,
  [LOG_LEVELS.INFO]: 1,
  [LOG_LEVELS.WARN]: 2,
  [LOG_LEVELS.ERROR]: 3
};

// Default log level
let currentLogLevel = LOG_LEVELS.INFO;

/**
 * Set the current log level
 * @param {string} level - Log level (debug, info, warn, error)
 */
function setLogLevel(level) {
  if (Object.values(LOG_LEVELS).includes(level)) {
    currentLogLevel = level;
  } else {
    console.error(`Invalid log level: ${level}`);
  }
}

/**
 * Check if a log level should be displayed based on current log level
 * @param {string} level - Log level to check
 * @returns {boolean} - True if the log should be displayed
 */
function shouldLog(level) {
  return LOG_LEVEL_PRIORITIES[level] >= LOG_LEVEL_PRIORITIES[currentLogLevel];
}

/**
 * Format a log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 * @returns {string} - Formatted log message
 */
function formatLogMessage(level, message, data) {
  const timestamp = new Date().toISOString();
  let formattedMessage = `[${timestamp}] [PicoZot] [${level.toUpperCase()}] ${message}`;
  
  if (data !== undefined) {
    if (data instanceof Error) {
      formattedMessage += `\n${data.stack || data.message}`;
    } else if (typeof data === 'object') {
      try {
        formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
      } catch (error) {
        formattedMessage += `\n[Object]`;
      }
    } else {
      formattedMessage += `\n${data}`;
    }
  }
  
  return formattedMessage;
}

/**
 * Log a message to the console
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
function log(level, message, data) {
  if (!shouldLog(level)) {
    return;
  }
  
  const formattedMessage = formatLogMessage(level, message, data);
  
  // Log to console
  switch (level) {
    case LOG_LEVELS.DEBUG:
      console.debug(formattedMessage);
      break;
    case LOG_LEVELS.INFO:
      console.info(formattedMessage);
      break;
    case LOG_LEVELS.WARN:
      console.warn(formattedMessage);
      break;
    case LOG_LEVELS.ERROR:
      console.error(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
  
  // Log to Zotero console if available
  try {
    if (typeof Zotero !== 'undefined' && Zotero.debug) {
      Zotero.debug(formattedMessage);
    }
  } catch (error) {
    // Ignore errors when Zotero is not available
  }
}

/**
 * Log a debug message
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
function debug(message, data) {
  log(LOG_LEVELS.DEBUG, message, data);
}

/**
 * Log an info message
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
function info(message, data) {
  log(LOG_LEVELS.INFO, message, data);
}

/**
 * Log a warning message
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
function warn(message, data) {
  log(LOG_LEVELS.WARN, message, data);
}

/**
 * Log an error message
 * @param {string} message - Log message
 * @param {any} data - Additional data to log
 */
function error(message, data) {
  log(LOG_LEVELS.ERROR, message, data);
}

/**
 * Initialize the logger
 * @param {Object} config - Configuration object
 */
function init(config = {}) {
  if (config.logLevel) {
    setLogLevel(config.logLevel);
  }
  
  debug('Logger initialized', { logLevel: currentLogLevel });
}

// Export logger functions
export const logger = {
  init,
  setLogLevel,
  debug,
  info,
  warn,
  error,
  LOG_LEVELS
};

// Initialize with default settings
init();
