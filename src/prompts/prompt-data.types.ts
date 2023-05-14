import { Joi } from '@shared/validation/joi-extensions';
import { CreateChatCompletionRequest } from 'openai';

export type UnknownPromptLocals = Record<string, unknown>;

export interface PromptDataBaseSchema<TPromptLocals = UnknownPromptLocals> {
  info: string;
  roleFilePath: string;
  promptFilePath: string;
  outputFilePath: string | ((promptLocals: TPromptLocals) => string | null) | null;
  promptLocals: TPromptLocals;
  saveToClipboard: boolean;
  parserOptions: {
    promptOnly: boolean;
    completionTransformer: ((completion: string) => string) | null;
  };
  aiCompletionRequestOptions: Pick<CreateChatCompletionRequest, 'model' | 'temperature' | 'top_p'>;
  verbose: boolean;
}

export type PromptDataNormalizedBaseSchema<TPromptLocals = UnknownPromptLocals> = Omit<
  PromptDataBaseSchema<TPromptLocals>,
  'outputFilePath'
> & {
  outputFilePath: string | null;
};

/**
 * Type that allows partial definition of prompt data from Base Schema + partial definition of locals (and nested props)
 * (not everything needs to be provided, something can be added by schema validation)
 *
 */
export type PromptDataBaseDefSettings<TPromptLocals = UnknownPromptLocals> = Partial<{
  [Key in keyof PromptDataBaseSchema<TPromptLocals>]: Key extends
    | 'promptLocals'
    | 'parserOptions'
    | 'aiCompletionRequestOptions'
    ? Partial<PromptDataBaseSchema<TPromptLocals>[Key]>
    : PromptDataBaseSchema<TPromptLocals>[Key];
}>;

/**
 * Schema for prompt data
 * - every file that contains the schema MUST export the following 2 objects
 *
 */
export interface PromptSchemaModuleExports<TPromptLocals = UnknownPromptLocals> {
  localsSchema: Joi.ObjectSchema<TPromptLocals>;
  defSettings: PromptDataBaseDefSettings<TPromptLocals>;
}
