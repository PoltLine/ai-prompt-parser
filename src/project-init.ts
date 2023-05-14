#!/usr/bin/env node
/* eslint-disable node/shebang */

import { CLI } from '@cli/constants';
import { ENV_VAR_NAMES } from '@api/constants';
import { createFoldersOnFolderPath, writeFile, isFile } from '@shared/helpers/files';
import { logger } from '@shared/logger';

// creating the project "prompts" folder
if (createFoldersOnFolderPath(CLI.projectFilesFolder)) {
  logger.success(`Project folder "${CLI.projectFilesFolder}" created!`);
} else {
  logger.info(`Project folder "${CLI.projectFilesFolder}" already exists!`);
}
// creating the project ".env" file
if (isFile(CLI.projectEnvFilePath)) {
  logger.info(`Project .env file "${CLI.projectEnvFilePath}" already exists!`);
} else {
  logger.info(`Creating project .env file "${CLI.projectEnvFilePath}" ...`);
  writeFile(CLI.projectEnvFilePath, `${ENV_VAR_NAMES.openAIApiKey}=<ADD_YOUR_KEY_HERE>\n`);
}
// creating the project "prompts" folder
if (createFoldersOnFolderPath(CLI.projectPromptSchemasFolderPath)) {
  logger.success(`Project Prompts folder "${CLI.projectPromptSchemasFolderPath}" created!`);
} else {
  logger.info(`Project Prompts folder "${CLI.projectPromptSchemasFolderPath}" already exists!`);
}
