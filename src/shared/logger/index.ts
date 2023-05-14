/* eslint-disable no-console */

import { bold, yellow, red, magenta, blue, green } from 'colorette';
import { isString } from '@shared/helpers/general';

const colourError = (newStr: string) => bold(red(newStr));
const colourWarning = (newStr: string) => bold(yellow(newStr));
const colourInfo = (newStr: string) => bold(blue(newStr));
const colourSuccess = (newStr: string) => bold(green(newStr));
const colourResult = (newStr: string) => magenta(newStr);

export enum LoggerFormat {
  Bold = 'bold',
}

function formatLog(message: string, format: LoggerFormat) {
  switch (format) {
    case LoggerFormat.Bold:
      return bold(message);
    default:
      return message;
  }
}

function error(message?: unknown, ...optionalParams: unknown[]) {
  console.error(
    isString(message)
      ? colourError(message)
      : message instanceof Error && message.stack
      ? colourError(message.stack)
      : message,
    ...optionalParams,
  );
}

/**
 * Convenience function that logs an error's message and then throws an exception
 *
 * @throws Error
 */
function errorAndThrowException(message: string, ...optionalParams: unknown[]) {
  error(message, ...optionalParams);
  throw new Error(message);
}

function warn(message?: unknown, ...optionalParams: unknown[]) {
  console.warn(isString(message) ? colourWarning(message) : message, ...optionalParams);
}

function log(message?: unknown, ...optionalParams: unknown[]) {
  console.log(message, ...optionalParams);
}

function logObject(object?: unknown) {
  console.dir(object, { depth: null, colors: true });
}

function info(message?: unknown, ...optionalParams: unknown[]) {
  console.info(isString(message) ? colourInfo(message) : message, ...optionalParams);
}

function result(message?: unknown, ...optionalParams: unknown[]) {
  console.log(isString(message) ? colourResult(message) : message, ...optionalParams);
}

function logFormat(message: string, format: LoggerFormat) {
  console.log(formatLog(message, format));
}

export const logger = {
  error,
  errorAndThrowException,
  warn,
  log,
  logObject,
  info,
  result,
  logFormat,
};
