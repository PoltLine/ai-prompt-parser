import appRootPath from 'app-root-path';
import { joinPaths } from '@shared/helpers/files';

const projectFilesFolder = joinPaths(appRootPath.path, 'ai-prompt');
const projectEnvFilePath = joinPaths(projectFilesFolder, '.env');
const projectMarkdownResultFilePath = joinPaths(projectFilesFolder, 'AI-RESULT.md');
const projectPromptSchemasFolderPath = joinPaths(projectFilesFolder, 'prompts');

export const CLI = {
  binCommandName: 'ai-prompt',
  projectFilesFolder,
  projectEnvFilePath,
  projectMarkdownResultFilePath,
  projectPromptSchemasFolderPath,
};
