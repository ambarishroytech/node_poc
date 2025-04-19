// Configures the winston logger for application logging.

import dotenv from "dotenv";
import winston from "winston";
import "winston-daily-rotate-file"; // Import the daily rotate file transport

// Load environment variables from .env file
dotenv.config();

// Define log levels
const logLevels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

// Define log level based on environment
const level = process.env.LOG_LEVEL || "info";

// Define log format
const logFormat = winston.format.combine(
	winston.format.timestamp({
		format: () => new Date().toISOString(), // Use UTC time
	}),
	winston.format.printf(({ timestamp, level, message }) => {
		return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
	}),
);

// Define transports
const transports = [
	new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple(),
		),
	}),
	new winston.transports.DailyRotateFile({
		filename: "logs/error-%DATE%.log", // Daily error log file
		datePattern: "YYYY-MM-DD", // Date format for log files
		level: "error",
		zippedArchive: true, // Compress old log files
		maxSize: "20m", // Maximum size of a log file
		maxFiles: "14d", // Keep logs for the last 14 days
	}),
	new winston.transports.DailyRotateFile({
		filename: "logs/combined-%DATE%.log", // Daily combined log file
		datePattern: "YYYY-MM-DD", // Date format for log files
		zippedArchive: true, // Compress old log files
		maxSize: "20m", // Maximum size of a log file
		maxFiles: "14d", // Keep logs for the last 14 days
	}),
];

// Create the logger
const logger = winston.createLogger({
	level,
	levels: logLevels,
	format: logFormat,
	transports,
});

// Export the logger
export default logger;
