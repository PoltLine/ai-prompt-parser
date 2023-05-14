import {
  readFile,
  replaceFilePathExtension,
  getFileExtension,
  getFilenameWithoutExtension,
  prefixFilePathExtension,
  joinPaths,
} from '@shared/helpers/files';
import { getEnclosedInStartAndEndMarkRegex } from '@shared/helpers/general';

export const promptSchemasAndTemplatesFolderPath = joinPaths(__dirname, 'prompts');
export const getPremadePromptTemplateFilePath = (promptTemplateFilePathInPromptFolder: string) =>
  joinPaths(promptSchemasAndTemplatesFolderPath, promptTemplateFilePathInPromptFolder);
export const getPremadePromptSchemaFilePath = (promptSchemaFilePathInPromptFolder: string) =>
  joinPaths(promptSchemasAndTemplatesFolderPath, promptSchemaFilePathInPromptFolder);

export const roleTemplatesFolderPath = joinPaths(__dirname, 'roles');
const premadeRoleTemplateFilePathObj = {
  assistant: 'assistant.ejs',
};
export const getRoleTemplateFilePath = (roleTemplateFilePathInRoleFolder: string) =>
  joinPaths(roleTemplatesFolderPath, roleTemplateFilePathInRoleFolder);
export const getPremadeRoleTemplateFilePathFromRoleName = (roleName: keyof typeof premadeRoleTemplateFilePathObj) =>
  getRoleTemplateFilePath(premadeRoleTemplateFilePathObj[roleName]);

/**
 * Reusable transformers
 *
 */
export const transformers = {
  /**
   * Markdown code completion transformer/extractor
   *
   */
  mdCodeExtractor: (newCode: string) => {
    // e.g.: starting with "```typescript" and ending with "```"
    // - or starting with "```" only (when prompting only for code)
    return (
      newCode.match(getEnclosedInStartAndEndMarkRegex('```', '```', '([A-Za-z]+\\b)?', '', false))?.[2]?.trim() || ''
    );
  },
};

/**
 * Default locals (mainly functions) that should be usable within templates
 * - these are included in every single template
 *
 */
export const defLocals = {
  /**
   * Read file or throw an error if file not found
   * - empty file is ok
   * @param ignoreNonExistingFile if true, the function will return an empty string instead of throwing an error
   *
   */
  readFile: (newFilePath: string, ignoreNonExistingFile = false) => {
    const content = readFile(newFilePath);
    if (content == null) {
      if (ignoreNonExistingFile) return '';
      throw new Error(`File "${newFilePath}" not found`);
    }
    return content;
  },

  /**
   * {@link replaceFilePathExtension}
   *
   */
  replaceFilePathExtension,

  /**
   * {@link prefixFilePathExtension}
   *
   */
  prefixFilePathExtension,

  /**
   * Determine the programming language of the source file based on the file extension
   * - e.g.: 'test.component.ts' -> 'Typescript'
   *
   */
  getSourceLangFromFileExtension: (newFilePath: string) => {
    const fileExtension = getFileExtension(newFilePath);
    if (!fileExtension) return 'unknown';
    let contentLang: string;
    switch (fileExtension.toLowerCase()) {
      case 'js':
      case 'jsx':
        contentLang = 'Javascript';
        break;
      case 'ts':
      case 'tsx':
        contentLang = 'Typescript';
        break;
      case 'java':
        contentLang = 'Java';
        break;
      default:
        contentLang = fileExtension.toUpperCase();
        break;
    }

    return contentLang;
  },

  /**
   * Determine the programming language of the source file based on the file extension
   * - e.g.: 'test.component.ts' -> 'component'
   *
   */
  getSourceObjectTypeFromFilename: (newFilePath: string) => {
    const filename = getFilenameWithoutExtension(newFilePath);
    return filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : 'unknown';
  },
};
