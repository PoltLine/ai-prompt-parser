// ////////
// Helpers MUST have no environment-dependent imports !!!
// ////////
import GPT3Tokenizer from 'gpt3-tokenizer'; // https://github.com/botisan-ai/gpt3-tokenizer#readme

type TokenizerType = ConstructorParameters<typeof GPT3Tokenizer>[0]['type'];

const gpt3Tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
const codexTokenizer = new GPT3Tokenizer({ type: 'codex' });

function getTokenizer(newType: TokenizerType) {
  switch (newType) {
    case 'gpt3':
      return gpt3Tokenizer;
    case 'codex':
      return codexTokenizer;
    default:
      return gpt3Tokenizer;
  }
}

export function tokenize(newStr: string, newType: TokenizerType) {
  const tokenizer = getTokenizer(newType);
  return tokenizer.encode(newStr);
}

export function detokenize(newBpe: number[], newType: TokenizerType) {
  const tokenizer = getTokenizer(newType);
  return tokenizer.decode(newBpe);
}
