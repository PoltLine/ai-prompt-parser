import clipboard from 'clipboardy';
import { writeFile } from '@shared/helpers/files';
import { logger } from '@shared/logger';

/**
 * Function that:
 * - if path specified, synchronously writes (overwrites) a file with the specified path
 * - if path not specified, logs the result into console
 *
 * @param newSaveToClipboard we additionally also save it to system clipboard (for easier use, can be pasted right away)
 *
 */
export function writeResultToFileOrLogIntoConsole(
  newContent: string,
  newFilePath?: string | null,
  newConsoleInfo?: string,
  newSaveToClipboard = true,
): void {
  const info = newConsoleInfo ? `"${newConsoleInfo}" ` : '';
  if (newFilePath) {
    logger.log(`Writing ${info}to file '${newFilePath}'`);
    writeFile(newFilePath, newContent);
  } else {
    logger.log(`Output file ${info ? `for ${info}` : ''}not specified, logging the prompt below:`);
    logger.result(newContent);
    if (newSaveToClipboard) {
      clipboard.writeSync(newContent);
      logger.info('NOTE: result COPIED to clipboard, you can paste it right away');
    }
  }
}
