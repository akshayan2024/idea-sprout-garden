const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    this.logs.push(logEntry);
    console.log(`[${logEntry.timestamp}] [${level}] ${message}`, data);

    // Send log to backend
    fetch('http://localhost:5000/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
    }).catch(error => console.error('Failed to send log to backend:', error));
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();