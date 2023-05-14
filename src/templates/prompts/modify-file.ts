import { Joi } from '@shared/validation/joi-extensions';
import { replaceFilePathExtension } from '@shared/helpers/files';
import { getPremadeRoleTemplateFilePathFromRoleName, transformers } from '../helpers';
import { PromptDataBaseSchema, PromptDataBaseDefSettings } from '@prompts/prompt-data.types';

const schemaFilePath = __filename;

export interface PromptLocalsSchema {
  instruction: string;
  contentFilePath: string;
}

export type PromptDataSchema = PromptDataBaseSchema<PromptLocalsSchema>;
export type PromptDataDefSettings = PromptDataBaseDefSettings<PromptLocalsSchema>;

export const localsSchema = Joi.object<PromptLocalsSchema>({
  instruction: Joi.string().required().description('Instruction of what to do'),
  contentFilePath: Joi.string().required().description('Path to the file to modify'),
});

export const defSettings: PromptDataDefSettings = {
  info: 'Modifying the provided file by applying the provided instruction',
  roleFilePath: getPremadeRoleTemplateFilePathFromRoleName('assistant'),
  promptFilePath: replaceFilePathExtension(schemaFilePath, '.ejs'),
  outputFilePath: (promptLocals: PromptLocalsSchema) => promptLocals.contentFilePath,
  parserOptions: {
    completionTransformer: transformers.mdCodeExtractor,
  },
};
