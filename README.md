# AI Prompt Parser
Generator and parser of templated AI prompts by using a Terminal.

# How to use
Install as a (preferably local) DEV dependency to your NPM project:
```sh
npm i -D ai-prompt-parser
```

Once installed, initialize the base setup (needs to be done only once per project).
```sh
npx ai-prompt-project-init
```

This creates an `ai-prompt/` folder in your project's root folder.
One of the created files is `ai-prompt/.env` into which you need to paste your generated OpenAI API key.
Here into `ai-prompt/prompts` folder it is also possible to place your custom Prompt Templates and Schemas (only CommonJS `.js` Schema files for now).

# Base control
After installation, the CLI is usable via the local `ai-prompt` command.

## Listing all available commands (Prompts)
```sh
npx ai-prompt
```

## Showing Help for a specific command
```sh
npx ai-prompt instruct --help
```

## Running your first CMD Prompt by using the `instruct` command
```sh
npx ai-prompt instruct -i "Tell me the command to list files in the active directory in Bash."
```

## Generating a unit test to a file in an Angular project by using the `jest-unit-test` command
```sh
npx ai-prompt jest-unit-test -c "<PATH_TO_FILE>"
```
The generated test file will by default go to the same folder (with the original file) with the original extension being prefixed by `.spec`. Angular is set as the default `framework` option to hint the AI about what the file contains - use `NestJS` or other values based on what you need.
Look into `npx ai-prompt jest-unit-test --help` for more info.

# TODO
- Dependency licences
