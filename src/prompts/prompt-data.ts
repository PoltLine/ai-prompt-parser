import { Joi, convertSchemaToJoiSchema } from '@shared/validation/joi-extensions';
import { isString } from '@shared/helpers/general';
import {
  UnknownPromptLocals,
  PromptDataBaseSchema,
  PromptDataNormalizedBaseSchema,
  PromptDataBaseDefSettings,
} from './prompt-data.types';
import { logger } from '@shared/logger';
import { TemplateManager, TemplateOf, TemplateLocalsObject } from '@templates/template-manager';
import { defLocals } from '@templates/helpers';

export enum AIModelName {
  Gpt35Turbo = 'gpt-3.5-turbo',
}

export const promptDataBaseDefSettings: PromptDataBaseDefSettings<unknown> = {
  parserOptions: {
    promptOnly: false,
    completionTransformer: null,
  },
  aiCompletionRequestOptions: {
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    top_p: null,
  },
};

// Schema factory
// - all root keys that are of type object MUST BE required
export const promptDataBaseSchemaFactory = <TPromptLocals>(newPromptLocalsSchema: Joi.ObjectSchema<TPromptLocals>) =>
  Joi.object<PromptDataBaseSchema<TPromptLocals>>({
    info: Joi.string().required().description('Info about the prompt - for logging purposes'),
    roleFilePath: Joi.string().required().description('Path to the role template file'),
    promptFilePath: Joi.string().required().description('Path to the prompt template file'),
    promptLocals: newPromptLocalsSchema.required().description('Locals for the prompt template (functions included)'),
    // if not provided, console will be used
    outputFilePath: Joi.alternatives(Joi.string(), Joi.function().arity(1))
      .allow(null)
      .default(null)
      .description(
        'Path to the output file, a resolver function with the promptLocals as parameter or undefined (console)',
      ),
    saveToClipboard: Joi.boolean().default(true).description('If true, the result is saved to the clipboard'),
    parserOptions: Joi.object({
      promptOnly: Joi.boolean()
        .default(false)
        .description('If true, no request is made to the AI, only the prompt is composed'),
      completionTransformer: Joi.function()
        .arity(1)
        .allow(null)
        .default(null)
        .description('Transformer for the AI completion'),
    })
      .required()
      .description('Options for the parser'),
    aiCompletionRequestOptions: Joi.object({
      model: Joi.string()
        .valid(...Object.values(AIModelName))
        .default(AIModelName.Gpt35Turbo)
        .description(`AI chat model`),
      temperature: Joi.number()
        .min(0)
        .max(2)
        .allow(null)
        .default(0.1)
        .description('Temperature for the AI completion request'),
      top_p: Joi.number().min(0).max(1).allow(null).default(null).description('Top p for the AI completion request'),
    })
      .required()
      .description('Options for the AI completion request'),
    verbose: Joi.boolean().default(false).description("If true, the prompt's settings are logged into the console"),
  });

export class PromptData<TPromptLocals = UnknownPromptLocals> {
  readonly settings: PromptDataNormalizedBaseSchema<TPromptLocals>;
  readonly schema: Joi.ObjectSchema<PromptDataBaseSchema<TPromptLocals>>;

  // pre-compiled templates
  // - we use dynamic types (created during runtime), so the types of locals in templates are just general
  private readonly roleTemplate: TemplateOf;
  private readonly promptTemplate: TemplateOf;

  constructor(
    private templateManager: TemplateManager,
    newSettings: PromptDataBaseDefSettings<TPromptLocals>,
    newPromptLocalsSchema: Joi.ObjectSchema<TPromptLocals>,
  ) {
    this.schema = PromptData.generateSchema<TPromptLocals>(newPromptLocalsSchema);
    this.settings = PromptData.validateAndNormalizeSettingsBySchema<TPromptLocals>(
      {
        ...promptDataBaseDefSettings,
        ...newSettings,
      },
      this.schema,
    );

    // pre-compiling templates (after validation)
    this.roleTemplate = this.templateManager.readAndSaveTemplateFile(this.settings.roleFilePath);
    this.promptTemplate = this.templateManager.readAndSaveTemplateFile(this.settings.promptFilePath);
  }

  /**
   * Function that can be used also outside of the class to generate the complete schema - locals included
   * (e.g. for parameter validation)
   * - function (if the provided schema is not Joi schmea) will also attempt to turn non-Joi schema (if possible)
   *   into Joi schema
   *
   */
  static generateSchema<TStatPromptLocals = UnknownPromptLocals>(
    newPromptLocalsSchema: Joi.ObjectSchema<TStatPromptLocals> | Joi.SchemaLike,
  ): Joi.ObjectSchema<PromptDataBaseSchema<TStatPromptLocals>> {
    const joiSchema = convertSchemaToJoiSchema<Joi.ObjectSchema<TStatPromptLocals>>(newPromptLocalsSchema);
    return promptDataBaseSchemaFactory(joiSchema);
  }

  /**
   * Function to validate and normalize the provided settings
   *
   */
  static validateAndNormalizeSettingsBySchema<TStatPromptLocals>(
    newSettings: PromptDataBaseDefSettings<TStatPromptLocals>,
    newSchema: Joi.ObjectSchema<PromptDataBaseSchema<TStatPromptLocals>>,
  ): PromptDataNormalizedBaseSchema<TStatPromptLocals> {
    // we disable aborting early to be able to print multiple errors
    // we allow unknown properties to be able to provide additional properties, e.g. functions in prompt locals, ...
    const validationResult = newSchema.validate(newSettings, { abortEarly: false, allowUnknown: true });
    if (validationResult.error) {
      const errorMessage = `Prompt settings contain errors -> ` + validationResult.error.message + '!';
      logger.error(errorMessage);
      throw new TypeError(errorMessage);
    }
    // validated and prefilled with schema defaults (if any provided)
    const modSettings = validationResult.value;
    if (modSettings.outputFilePath && !isString(modSettings.outputFilePath)) {
      modSettings.outputFilePath = modSettings.outputFilePath(modSettings.promptLocals);
    }
    return modSettings as PromptDataNormalizedBaseSchema<TStatPromptLocals>;
  }

  renderRole() {
    return this.roleTemplate({ ...this.settings, ...defLocals } as unknown as TemplateLocalsObject).trim();
  }

  renderPrompt() {
    return this.promptTemplate({ ...this.settings, ...defLocals } as unknown as TemplateLocalsObject).trim();
  }

  render() {
    return {
      role: this.renderRole(),
      prompt: this.renderPrompt(),
    };
  }
}
