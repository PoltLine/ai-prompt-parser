import { config } from 'dotenv';
import { preInit, init, runPrompt, isEnvSet } from '@api/api';
import { CLI } from './constants';
import { PromptData } from '@prompts/prompt-data';
import { TemplateManager } from '@templates/template-manager';
import { loadPromptSchema, listAvailableInfo } from './helpers';
import { parseArguments } from './argument-parse';

// reading environment configuration from the project-local .env file
// - the path to file will be printed out to console if environment vars not set
config({ path: CLI.projectEnvFilePath, debug: !isEnvSet() });

// shared Template Manager
const templateManager = new TemplateManager();

async function run() {
  const schemaFilePath = process.argv.slice(2)?.[0];

  if (!schemaFilePath) {
    listAvailableInfo();
    return;
  }

  const { localsSchema, defSettings } = await loadPromptSchema(schemaFilePath);

  // checking CLI arguments
  const defSettingsWithCmdArgs = parseArguments(schemaFilePath, PromptData.generateSchema(localsSchema), defSettings);

  // creation of Prompt data
  const promptData = new PromptData(templateManager, defSettingsWithCmdArgs, localsSchema);

  // API pre-init check
  if (!preInit(promptData)) return;

  // API initialization
  const openAIapi = init();

  // running the Prompt using the API
  await runPrompt(promptData, openAIapi);
}

run();
