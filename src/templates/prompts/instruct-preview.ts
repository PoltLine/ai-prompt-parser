import { CLI } from '@cli/constants';
import {
  localsSchema as instructLocalsSchema,
  defSettings as instructDefSettings,
  PromptDataDefSettings as InstructPromptDefSettings,
} from './instruct';

const localsSchema = instructLocalsSchema;

const defSettings: InstructPromptDefSettings = {
  ...instructDefSettings,
  info: 'Instruction for the AI with the result printed into a markdown file',
  outputFilePath: CLI.projectMarkdownResultFilePath,
};

export { localsSchema, defSettings };
