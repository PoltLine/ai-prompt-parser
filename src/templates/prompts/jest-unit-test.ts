import { Joi } from '@shared/validation/joi-extensions';
import { replaceFilePathExtension } from '@shared/helpers/files';
import { getPremadeRoleTemplateFilePathFromRoleName, transformers, defLocals } from '../helpers';
import { PromptDataBaseSchema, PromptDataBaseDefSettings } from '@prompts/prompt-data.types';

const schemaFilePath = __filename;

export interface PromptLocalsSchema {
  framework: string;
  contentFilePath: string;
}

export type PromptDataSchema = PromptDataBaseSchema<PromptLocalsSchema>;
export type PromptDataDefSettings = PromptDataBaseDefSettings<PromptLocalsSchema>;

export const localsSchema = Joi.object<PromptLocalsSchema>({
  framework: Joi.string()
    .default('Angular')
    .description('Framework used in the project, e.g. "Angular", "React", "NestJS'),
  contentFilePath: Joi.string().required().description('Path to the file to modify'),
});

export const defSettings: PromptDataDefSettings = {
  info: 'Generation of a Jest unit test from the provided file',
  roleFilePath: getPremadeRoleTemplateFilePathFromRoleName('assistant'),
  promptFilePath: replaceFilePathExtension(schemaFilePath, '.ejs'),
  outputFilePath: (promptLocals: PromptLocalsSchema) =>
    // we by default add ".spec" prefix to the file extension
    defLocals.prefixFilePathExtension(promptLocals.contentFilePath, '.spec'),
  parserOptions: {
    completionTransformer: transformers.mdCodeExtractor,
  },
};
