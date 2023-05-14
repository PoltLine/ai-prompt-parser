// ////////
// Helpers MUST have no environment-dependent imports !!!
// ////////

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  WriteFileOptions,
  writeFileSync,
} from 'fs'; // TODO: swap for 'fs-extra'
import { PropertiesObj } from './types';
import { convertLFtoCRLF } from './general';

import * as path from 'path';

const defEncoding = 'utf8';

/**
 * Function that synchronously checks if file exists and reads it with the given encoding or returns null
 *
 */
export function readFile(newFilePath: string, newFileEncoding: BufferEncoding = defEncoding): string | null {
  if (existsSync(newFilePath)) {
    return readFileSync(newFilePath, { encoding: newFileEncoding });
  }
  return null; // if file not found
}

/**
 * Function that synchronously checks if file exists, reads it with the given encoding and parses as JSON - returns
 * an object
 * - if the file does not exist, null is returned
 *
 */
export function readFileAsJSON(
  newFilePath: string,
  newFileEncoding: BufferEncoding = defEncoding,
): PropertiesObj | null {
  const fileContent = readFile(newFilePath, newFileEncoding);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return fileContent ? JSON.parse(fileContent) : null;
}

/**
 * Function that synchronously checks if given files exist, reads them one by one with the given encoding,
 * parses each as JSON and merges them into each other - returns an object
 * - if any of the files does not exist, null is returned
 *
 */
export function readFilesAsJSONAndMerge(
  newFilesPaths: string[],
  newFileEncoding: BufferEncoding = defEncoding,
): PropertiesObj | null {
  let mergedObj: PropertiesObj = {};
  let fileContent;
  for (const filePath of newFilesPaths) {
    fileContent = readFileAsJSON(filePath, newFileEncoding);
    if (!fileContent) {
      return null;
    } else {
      mergedObj = { ...mergedObj, ...fileContent };
    }
  }
  return mergedObj;
}

/**
 * Function that returns the file extension (without the dot)
 * - e.g. 'folder/file.new.zip' -> 'zip'
 *
 * @param newFilePath path to the file
 */
export function getFileExtension(newFilePath: string): string {
  return path.extname(newFilePath).substring(1); // we ignore/remove the starting dot (if exists)
  // 'substring' function does not throw errors with wrong indexes, so, even if the index does not exist (the file
  // extension is an empty string), nothing happens and empty string is returned
}

/**
 * Function that returns the file name (with extension)
 * - e.g. 'folder/file.new.zip' -> 'file.new.zip'
 *
 * @param newFilePath path to the file
 */
export function getFilename(newFilePath: string): string {
  return path.basename(newFilePath);
}

/**
 * Function that returns the file name without extension
 * - e.g. 'folder/file.new.zip' -> 'file.new'
 *
 * @param newFilePath path to the file
 */
export function getFilenameWithoutExtension(newFilePath: string): string {
  return path.parse(newFilePath).name;
}

export function getAbsoluteFilePath(newFilePath: string): string {
  return path.resolve(newFilePath);
}

/**
 * Function that synchronously writes (overwrites) a file with the specified path
 * - used for standard text files
 *
 */
export function writeFile(newFilePath: string, newFileContent: string): void {
  writeFileSync(newFilePath, newFileContent);
}

/**
 * Function that synchronously writes (overwrites) a file with the specified path
 * - used for standard text files
 * - forces CRLF line endings
 *
 */
export function writeFileCRLF(newFilePath: string, newFileContent: string): void {
  writeFile(newFilePath, convertLFtoCRLF(newFileContent));
}

/**
 * Function that synchronously writes (overwrites) a file with the specified path
 * - used for files other than text files (e.g. binary files) or text files
 *
 */
export function writeFileSpecial(newFilePath: string, newFileContent: string, newFileOptions?: WriteFileOptions): void {
  writeFileSync(newFilePath, newFileContent, newFileOptions);
}

/**
 * Function that synchronously writes (overwrites) a file with the specified path
 * - used for writing base64-encoded data (will be decoded before writing)
 *
 */
export function writeFileBase64(newFilePath: string, newFileContent: string): void {
  writeFileSpecial(newFilePath, newFileContent, 'base64');
}

/**
 * Function that synchronously reads all the files inside a folder
 * - returns an array of file paths
 * - folders inside this folder will be ignored (not recursive)
 *
 * @param newAllowedExtensionList an array of allowed extensions (without starting '.')
 * - only paths of files with this extension will be returned
 * - case-insensitive
 *
 */
export function readFilesFromFolder(newFolderPath: string, newAllowedExtensionList?: string[]) {
  const allowedExtensionList = !newAllowedExtensionList
    ? newAllowedExtensionList
    : newAllowedExtensionList.map((ext) => ext.toLowerCase());
  const paths = readdirSync(newFolderPath)
    .filter(
      (filename) => !allowedExtensionList || allowedExtensionList.includes(getFileExtension(filename).toLowerCase()),
    )
    .map((fileName) => `${newFolderPath}/${fileName}`);
  return paths.filter((elem) => {
    return !statSync(elem).isDirectory();
  });
}

/**
 * Function that synchronously reads all the files inside a folder
 * - returns an array of file paths
 * - recursive
 *
 */
export function readFilesFromFolderRecursive(newFolderPath: string, newAllowedExtensionList?: string[]): string[] {
  let outFilePaths: string[] = [];
  const folders = readFoldersFromFolder(newFolderPath);
  for (const [_, folderPath] of folders) {
    outFilePaths = outFilePaths.concat(readFilesFromFolderRecursive(folderPath, newAllowedExtensionList));
  }
  outFilePaths = outFilePaths.concat(readFilesFromFolder(newFolderPath, newAllowedExtensionList));
  return outFilePaths;
}

/**
 * Function that synchronously reads all the folders inside a folder
 * - returns an array of tuples [folder_name, folder_path]
 * - files (not folders) inside this folder will be ignored
 * - not recursive
 *
 */
export function readFoldersFromFolder(newFolderPath: string): [string, string][] {
  return readdirSync(newFolderPath)
    .map((name) => [name, `${newFolderPath}/${name}`] as [string, string])
    .filter((elem) => statSync(elem[1]).isDirectory());
}

/**
 * Function that - if folder on the path does not exist - synchronously and recursively creates folders on the
 * specified path
 * - if the folder already exists, nothing happens
 *
 */
export function createFoldersOnFolderPath(newFolderPath: string) {
  if (existsSync(newFolderPath)) {
    // folder on the path already exists
    return false;
  }
  mkdirSync(newFolderPath, { recursive: true });
  return true;
}

/**
 * Function that synchronously and recursively removes all contents of the folder on the specified path
 * - if the path is not a folder or the path does not exist, nothing will happen
 *
 */
export function removeFolderContents(newFolderPath: string) {
  if (!isFolder(newFolderPath)) {
    return;
  }
  const paths = readdirSync(newFolderPath);

  let jointPath: string;
  for (const path of paths) {
    jointPath = joinPaths(newFolderPath, path);
    if (statSync(jointPath).isDirectory()) {
      // directory
      rmSync(jointPath, { recursive: true });
    } else {
      // file
      unlinkSync(jointPath);
    }
  }
}

/**
 * Function that creates a path from the provided paths
 * - if we provide folder path '/Users/.../Sync/sync.ts' and a file path (relative path) './xyz/x.png', then the
 * returned path will be:
 * '/Users/.../Sync/xyz/x.png'
 *
 */
export function joinPaths(...newPaths: string[]) {
  return path.join(...newPaths);
}

/**
 * Function that checks if 2 paths match
 *
 */
export function checkIfPathsMatch(newPath1: string, newPath2: string) {
  return getAbsoluteFilePath(newPath1) === getAbsoluteFilePath(newPath2);
}

/**
 * Function that checks if a folder is an ancestor folder of the path
 *
 */
export function isFolderPathAncestorOf(newAncestorFolderPath: string, newPath: string) {
  const parentFolderPath = normalizePath(newAncestorFolderPath, true);
  let path = normalizePath(newPath);
  if (newAncestorFolderPath.length >= newPath.length) return false;
  while (path.includes('/')) {
    path = normalizePath(getParentFolderPath(path));
    if (parentFolderPath === path) return true;
  }
  return false;
}

/**
 * Function that returns the path of the parent folder
 * - if we provide file path '/Users/.../Parent/Sync/sync.ts', the result is '/Users/.../Parent/Sync'
 * - if we provide folder path '/Users/.../Parent/Sync/', the result is '/Users/.../Parent'
 * - the trailing slash is not added
 *
 * @param newDepth a positive integer meaning which ancestor folder's path we need
 * - 1 (default) means the direct parent folder
 *
 */
export function getParentFolderPath(newPath: string, newDepth = 1): string {
  let ancestorFolderPath = newPath;
  for (let i = 0; i < newDepth; i++) {
    ancestorFolderPath = path.dirname(ancestorFolderPath);
  }
  return ancestorFolderPath;
}

export function addTrailingFolderSeparator(newPath: string) {
  // maybe should be using path.sep https://nodejs.org/api/path.html#pathsep for cross-platform solution
  newPath += newPath && !newPath.endsWith('/') ? '/' : '';
  return newPath;
}

export function removeTrailingFolderSeparator(newPath: string) {
  // maybe should be using path.sep https://nodejs.org/api/path.html#pathsep for cross-platform solution
  return newPath.endsWith('/') ? newPath.substring(0, newPath.length - 1) : newPath;
}

/**
 * https://nodejs.org/api/path.html#pathnormalizepath
 * @param isFolderPath if true, trailing folder separator will be added to path
 * @param useTrailingFolderSeparator if true, trailing folder separator will be added, otherwise it will be removed
 * - only works if isFolderPath is true
 *
 */
export function normalizePath(newPath: string, isFolderPath = false, useTrailingFolderSeparator = false) {
  if (!newPath && isFolderPath) {
    newPath = '.';
  }
  if (isFolderPath) {
    newPath = useTrailingFolderSeparator ? addTrailingFolderSeparator(newPath) : removeTrailingFolderSeparator(newPath);
  }
  return path.normalize(newPath);
}

/**
 * Function that synchronously checks if path exists
 *
 */
export function checkIfPathExists(newPath: string): boolean {
  if (existsSync(newPath)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Function that synchronously checks if the path exists and if it is a File
 *
 */
export function isFile(newFilePath: string) {
  return checkIfPathExists(newFilePath) && statSync(newFilePath).isFile();
}

/**
 * Function that synchronously checks if the path exists and if it is a Folder
 *
 */
export function isFolder(newFolderPath: string) {
  return checkIfPathExists(newFolderPath) && statSync(newFolderPath).isDirectory();
}

/**
 * Function that:
 * - if path specified, synchronously writes (overwrites) a file with the specified path
 *
 */
export function writeFileIfPathProvided(newFilePath: string, newFileContent: string): void {
  if (newFilePath) {
    writeFile(newFilePath, newFileContent);
  }
}

/**
 * Function that retrieves the base information about a file
 *
 */
export function getFileInfo(newFilePath: string) {
  return {
    folderPath: getParentFolderPath(newFilePath),
    filenameWithoutExtension: getFilenameWithoutExtension(newFilePath),
    fileExtension: getFileExtension(newFilePath),
  };
}

/**
 * Replace the file extension in the provided file path by another one
 * - convenience function that can be used to create a different suffix, e.g:
 *   - .ts -> .spec.ts
 * - dot ('.') must be included in the new extension (it is not added automatically)
 *
 */
export function replaceFilePathExtension(newFilePath: string, newExtension: string) {
  const fileInfo = getFileInfo(newFilePath);
  return joinPaths(fileInfo.folderPath, fileInfo.filenameWithoutExtension + newExtension);
}

/**
 * Prefix the file extension in the provided file path by another one
 * - convenience function that can be used to create a different suffix, e.g:
 *   - .ts -> .spec.ts (we only provide '.spec' as the new extension prefix)
 * - dot ('.') must be included in the new extension prefix (if needed)
 *
 */
export function prefixFilePathExtension(newFilePath: string, newExtensionPrefix: string) {
  const fileInfo = getFileInfo(newFilePath);
  return replaceFilePathExtension(
    newFilePath,
    newExtensionPrefix + (fileInfo.fileExtension ? '.' + fileInfo.fileExtension : ''),
  );
}
