import { getAbsoluteFilePath, joinPaths } from '@shared/helpers/files';

const projectFilesFolder = getAbsoluteFilePath('ai-prompt');
const projectMarkdownResultFilePath = joinPaths(projectFilesFolder, 'AI-RESULT.md');
const projectPromptSchemasFolderPath = joinPaths(projectFilesFolder, 'prompts');

export const CLI = {
  binCommandName: 'ai-prompt',
  projectFilesFolder,
  projectMarkdownResultFilePath,
  projectPromptSchemasFolderPath,
};
