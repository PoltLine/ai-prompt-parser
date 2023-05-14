import {
  getPremadePromptSchemaFilePath,
  promptSchemasAndTemplatesFolderPath,
  roleTemplatesFolderPath,
} from '@templates/helpers';
import {
  joinPaths,
  getAbsoluteFilePath,
  checkIfPathExists,
  readFilesFromFolderRecursive,
  isFolder,
} from '@shared/helpers/files';
import { logger, LoggerFormat } from '@shared/logger';
import { isObject } from '@shared/helpers/general';
import { PromptSchemaModuleExports } from '@prompts/prompt-data.types';
import { CLI } from './constants';
import { TEMPLATE, PROMPT_SCHEMA } from '@templates/constants';

type SchemaPathError = { message: string };

function createErrorObj(newMessage: string): SchemaPathError {
  return { message: newMessage };
}

type FileInfo = { path: string; fullPath: string };

export function listAvailableInfo() {
  const logFileInfo = (file: FileInfo, logOnlyFullPath = false, removeExtension = true) => {
    if (logOnlyFullPath) logger.info(file.fullPath);
    else {
      logger.info(file.path.slice(0, removeExtension ? -PROMPT_SCHEMA.extension.length : undefined));
      logger.log(`- "${file.fullPath}"`);
    }
  };
  logger.log('No command provided, listing available prompts and roles:');
  const availablePromptSchemaFilesInfo = getAvailablePremadeAndProjectFilesInfo(
    promptSchemasAndTemplatesFolderPath,
    CLI.projectPromptSchemasFolderPath,
    [PROMPT_SCHEMA.extension.slice(1)],
  );
  // prompt schemas
  logger.logFormat('-- PROMPTS --', LoggerFormat.Bold);
  logger.logFormat('PRE-MADE Prompt Schemas:', LoggerFormat.Bold);
  availablePromptSchemaFilesInfo.premade.forEach((fileInfo) => logFileInfo(fileInfo));
  logger.logFormat('PROJECT Prompt Schemas:', LoggerFormat.Bold);
  if (availablePromptSchemaFilesInfo.project.length === 0) {
    logger.log('- No project Prompt Schemas found.');
  } else {
    availablePromptSchemaFilesInfo.project.forEach((fileInfo) => logFileInfo(fileInfo));
  }
  // role templates
  const availableRoleTemplateFilesInfo = getAvailablePremadeAndProjectFilesInfo(roleTemplatesFolderPath, undefined, [
    TEMPLATE.extension.slice(1),
  ]);
  logger.logFormat('-- ROLES --', LoggerFormat.Bold);
  logger.logFormat('PRE-MADE Role Templates:', LoggerFormat.Bold);
  availableRoleTemplateFilesInfo.premade.forEach((fileInfo) => logFileInfo(fileInfo, true));
  logger.logFormat('PROJECT Role Templates:', LoggerFormat.Bold);
  if (availableRoleTemplateFilesInfo.project.length === 0) {
    logger.log('- No project Role Templates found.');
  } else {
    availableRoleTemplateFilesInfo.project.forEach((fileInfo) => logFileInfo(fileInfo, true));
  }

  //const availableRoleFiles
}

export function getAvailablePremadeAndProjectFilesInfo(
  newPremadeFolderPath: string,
  newProjectFolderPath?: string,
  newAllowedExtensionList?: string[],
): {
  premade: FileInfo[];
  project: FileInfo[];
} {
  const premadeFiles =
    newPremadeFolderPath && isFolder(newPremadeFolderPath)
      ? readFilesFromFolderRecursive(newPremadeFolderPath, newAllowedExtensionList).map((filePath) => ({
          path: filePath.slice(newPremadeFolderPath.length + 1), // relative path (without the root folder)
          fullPath: filePath,
        }))
      : [];
  const projectFiles =
    newProjectFolderPath && isFolder(newProjectFolderPath)
      ? readFilesFromFolderRecursive(newProjectFolderPath, newAllowedExtensionList).map((filePath) => ({
          path: filePath.slice(newProjectFolderPath.length + 1), // relative path (without the root folder)
          fullPath: filePath,
        }))
      : [];
  return { premade: premadeFiles, project: projectFiles };
}

export function resolveSchemaFilePath(
  newSchemaFilePath: string,
): { error: null; schemaFilePath: string } | { error: SchemaPathError; schemaFilePath: null } {
  // checks
  if (!newSchemaFilePath) {
    // a valid string must be provided
    return { error: createErrorObj('No schema file path provided!'), schemaFilePath: null };
  }
  // only allow PROMPT_SCHEMA.extension ('.js') file
  // - if extension not provided, we add it
  if (!newSchemaFilePath.endsWith(PROMPT_SCHEMA.extension)) {
    logger.info(`Adding "${PROMPT_SCHEMA.extension}" extension to "${newSchemaFilePath}" schema file path.`);
    newSchemaFilePath += PROMPT_SCHEMA.extension;
  }
  // absolute/relative path to an arbitrary file
  const schemaFilePath = newSchemaFilePath;
  // project schema file
  const projectSchemaFilePath = joinPaths(CLI.projectPromptSchemasFolderPath, newSchemaFilePath);
  // premade (from module) schema file
  const premadeSchemaFilePath = getPremadePromptSchemaFilePath(newSchemaFilePath);
  let absPath: string;
  const erroredPaths: string[] = [];
  for (const path of [schemaFilePath, projectSchemaFilePath, premadeSchemaFilePath]) {
    absPath = getAbsoluteFilePath(path); // make sure the path is absolute
    if (checkIfPathExists(absPath)) {
      return { error: null, schemaFilePath: absPath };
    } else {
      erroredPaths.push(absPath);
    }
  }
  return {
    error: createErrorObj(
      `Cannot find "${newSchemaFilePath}" schema file under any of the following paths:\n${erroredPaths
        .map((erroredPath) => `- "${erroredPath}"`)
        .join('\n')}!`,
    ),
    schemaFilePath: null,
  };
}

export async function loadPromptSchema(newSchemaFilePath: string): Promise<PromptSchemaModuleExports> {
  const { error, schemaFilePath } = resolveSchemaFilePath(newSchemaFilePath);
  if (error) {
    // prompt schema file could not be loaded
    logger.error(error.message);
    listAvailableInfo();
    throw new Error(error.message);
  } else {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { localsSchema, defSettings } = (await import(schemaFilePath)) as PromptSchemaModuleExports;

    if (!isObject(localsSchema) || !isObject(defSettings)) {
      logger.errorAndThrowException(
        `The "${schemaFilePath}" schema file does not export the required "localsSchema" and "defSettings" objects!`,
      );
    }
    return { localsSchema, defSettings };
  }
}
