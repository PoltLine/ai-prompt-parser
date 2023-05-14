import { Joi } from '@shared/validation/joi-extensions';
import { replaceFilePathExtension } from '@shared/helpers/files';
import { getPremadeRoleTemplateFilePathFromRoleName } from '../helpers';
import { PromptDataBaseSchema, PromptDataBaseDefSettings } from '@prompts/prompt-data.types';

const schemaFilePath = __filename;

export interface PromptLocalsSchema {
  instruction: string;
}

export type PromptDataSchema = PromptDataBaseSchema<PromptLocalsSchema>;
export type PromptDataDefSettings = PromptDataBaseDefSettings<PromptLocalsSchema>;

export const localsSchema = Joi.object<PromptLocalsSchema>({
  instruction: Joi.string().required().description('Instruction of what to do'),
});

export const defSettings: PromptDataDefSettings = {
  info: 'Instruction for the AI with the result printed into the console',
  roleFilePath: getPremadeRoleTemplateFilePathFromRoleName('assistant'),
  promptFilePath: replaceFilePathExtension(schemaFilePath, '.ejs'),
};
