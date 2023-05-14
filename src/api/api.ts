import { OpenAIApi, Configuration } from 'openai';
import { tokenize } from '@shared/helpers/encoding';
import { logger } from '@shared/logger';
import { ENV_VAR_NAMES, MAX_COMPLETION_TOKEN_COUNT } from './constants';
import { PromptData } from '@prompts/prompt-data';
import { writeResultToFileOrLogIntoConsole } from './helpers';

/**
 * Function called before init to check if it even needs/should to be called
 * @returns boolean - if true, init should be called; if false, the api init and use should be skipped
 *
 */
export function preInit(newPromptData: PromptData<Record<string, unknown>>): boolean {
  // Verbose mode
  if (newPromptData.settings.verbose) {
    logger.log(`Verbose mode ACTIVE - the prompt's settings are:`);
    logger.logObject(newPromptData.settings);
  }

  // Prompt-only mode
  if (newPromptData.settings.parserOptions.promptOnly) {
    logger.log('Prompt-only mode ACTIVE - no request will be made and only logging into console.');
    writeResultToFileOrLogIntoConsole(
      newPromptData.renderPrompt(),
      undefined,
      'prompt',
      newPromptData.settings.saveToClipboard,
    );
    return false;
  }

  return true;
}

function getEnvApiKey() {
  // eslint-disable-next-line node/no-process-env
  return process.env[ENV_VAR_NAMES.openAIApiKey];
}
export function isEnvSet() {
  return !!getEnvApiKey();
}

export function init(): OpenAIApi {
  const configuration = new Configuration({
    apiKey: getEnvApiKey(),
  });

  if (!configuration.apiKey) {
    logger.error(
      // eslint-disable-next-line max-len
      'OpenAI API key not configured - OPENAI_API_KEY environment variable does not have a valid value, please follow instructions in README!',
    );
    throw new Error('OpenAI API key not configured!');
  }
  return new OpenAIApi(configuration);
}

export async function runPrompt(
  newPromptData: PromptData<Record<string, unknown>>,
  newOpenAIApi: OpenAIApi,
  newWarningTokenCount = MAX_COMPLETION_TOKEN_COUNT / 2,
  newMaxTokenCount = MAX_COMPLETION_TOKEN_COUNT,
): Promise<void> {
  const roleContent = newPromptData.renderRole();
  const promptContent = newPromptData.renderPrompt();

  // Checking the number of tokens
  const tokenCount = tokenize(roleContent, 'gpt3').text.length + tokenize(promptContent, 'gpt3').text.length;
  const remainingTokenCount = newMaxTokenCount - tokenCount;

  logger.info(
    `Your prompt (and role) contains ${tokenCount} out of allowed ${newMaxTokenCount} tokens - you have ${
      remainingTokenCount <= 0 ? 0 : remainingTokenCount
    } tokens left for the completion!`,
  );
  if (tokenCount >= newMaxTokenCount) {
    logger.error(`Maximum number of tokens (${newMaxTokenCount}) reached, no more left for the completion!`);
    throw new Error('Maximum number of tokens reached!');
  } else if (tokenCount >= newWarningTokenCount) {
    logger.warn(
      `You have reached a high number of input tokens - it may be possible that the completion will be truncated!`,
    );
  }

  // Making the request
  logger.info('Asking AI ...');
  try {
    const completion = await newOpenAIApi.createChatCompletion({
      messages: [
        {
          role: 'system',
          content: roleContent,
        },
        {
          role: 'user',
          content: promptContent,
        },
      ],
      ...newPromptData.settings.aiCompletionRequestOptions,
    });
    if (completion) {
      const completionContent = completion.data.choices?.[0].message?.content; // for now we only parse 1 choice
      if (!completionContent) {
        logger.errorAndThrowException('No data inside the completion!');
      } else {
        // applying transformer (if provided)
        const parsedCompletionContent = newPromptData.settings.parserOptions.completionTransformer
          ? newPromptData.settings.parserOptions.completionTransformer(completionContent)
          : completionContent;
        if (parsedCompletionContent) {
          writeResultToFileOrLogIntoConsole(
            parsedCompletionContent,
            newPromptData.settings.outputFilePath,
            'result',
            newPromptData.settings.saveToClipboard,
          );
        } else {
          logger.warn('No parsed completion data, printing the whole completion instead:');
          logger.warn(completionContent);
        }
      }
    } else {
      logger.errorAndThrowException('No completion data returned');
    }
  } catch (error: unknown) {
    // Consider adjusting the error handling logic for your use case
    const errorTyped = error as { response?: { status: number; data: unknown }; message: string };
    if (errorTyped.response) {
      logger.error(errorTyped.response.status, errorTyped.response.data);
      logger.errorAndThrowException('Error occured!');
    } else {
      logger.error(`Error with OpenAI API request: ${errorTyped.message}`);
      throw new Error('An error occurred during the request!');
    }
  }
}
