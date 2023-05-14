import { CLI } from '@cli/constants';
import {
  localsSchema as modifyFileLocalsSchema,
  defSettings as modifyFileDefSettings,
  PromptDataDefSettings as ModifyFilePromptDefSettings,
} from './modify-file';

const localsSchema = modifyFileLocalsSchema;

const defSettings: ModifyFilePromptDefSettings = {
  ...modifyFileDefSettings,
  info: 'Analyzing the provided file by applying the provided instruction with the result printed into a markdown file',
  outputFilePath: CLI.projectMarkdownResultFilePath,
  parserOptions: {
    completionTransformer: null,
  },
};

export { localsSchema, defSettings };
