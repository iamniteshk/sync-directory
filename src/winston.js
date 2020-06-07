const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const remote = window.require('electron').remote;
const app = remote.app;
const path = require('path');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});


const logFormat = combine(
    label({ label: 'Sync-Directory-App' }),
    format.colorize(),
    timestamp(),
    format.align(),
    myFormat
);

const logger = createLogger({
    format: logFormat,
    transports: [
        new WinstonDailyRotateFile({
            filename: `${app.getPath(`logs`)}${path.sep}${app.getName()}${path.sep}custom-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'info'
        }),
        new transports.Console({
            level: 'info',
            handleExceptions: true
        })
    ],
    exitOnError: false
});

module.exports = logger;