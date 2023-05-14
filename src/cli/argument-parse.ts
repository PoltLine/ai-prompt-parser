/* eslint-disable @typescript-eslint/no-unsafe-return */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  Joi,
  JoiObjectSchemaKeysPartialDescription,
  getObjectSchemaKeysDescription,
  JoiObjectSchemaKeyPartialDescription,
  isPrimitiveJoiSchemaType,
  isObjectJoiSchemaType,
  isBooleanJoiSchemaType,
  isNumberJoiSchemaType,
  isStringJoiSchemaType,
} from '@shared/validation/joi-extensions';
import {
  transformAllNestedObjPropsThatFulfillPredicate,
  isObject,
  getLastElemOfArray,
  getNestedObjPropFromKeyPathWithValue,
  mergeObjs,
} from '@shared/helpers/general';
import { PromptDataBaseSchema, PromptDataBaseDefSettings } from '@prompts/prompt-data.types';
import { CLI } from './constants';

type JoiObjectSchemaKeyYargsArgPartialDescription = JoiObjectSchemaKeyPartialDescription & {
  argPath: string[];
};

function convertJoiAlternativeSchemaDescriptionsToTheirSubSchemasIfPrimitiveOrRemove(
  newSchemaYargsArgPartialDescriptions: JoiObjectSchemaKeyYargsArgPartialDescription[],
) {
  const outArray: JoiObjectSchemaKeyYargsArgPartialDescription[] = [];
  for (const description of newSchemaYargsArgPartialDescriptions) {
    let alternativeSchemas;
    if (description.type === 'alternatives') {
      alternativeSchemas = description?.matches || [];
      for (const alternativeSchema of alternativeSchemas) {
        if (isPrimitiveJoiSchemaType(alternativeSchema?.schema?.type)) {
          description.type = alternativeSchema?.schema?.type; // changing the type to the type of alternative schema
          outArray.push(description);
        }
      }
    } else {
      outArray.push(description); // non-"alternative" stays without change
    }
  }
  return outArray;
}

type YargsOptionsObj = { [optionPath: string]: yargs.Options };

// This function should only get the primitive (of schemas with primitive types) descriptions
function convertSchemaYargsArgPartialDescriptionsToYargsOptionsObj(
  newSchemaYargsArgPartialDescriptions: JoiObjectSchemaKeyYargsArgPartialDescription[],
  newDefSettings: PromptDataBaseDefSettings,
): YargsOptionsObj {
  const outObj: YargsOptionsObj = {};
  const usedSingleLetterAliases = new Set<string>();
  newSchemaYargsArgPartialDescriptions.forEach((descriptionObj) => {
    const optionName = getLastElemOfArray(descriptionObj.argPath) as string;
    const optionPath = descriptionObj.argPath.join('.');
    let optionAlias: string | undefined = optionName[0]; // the first letter of the option name
    if (
      (descriptionObj.argPath[0] === 'promptLocals' || optionPath === 'outputFilePath') &&
      !usedSingleLetterAliases.has(optionAlias)
    ) {
      // the first letter of the option name
      usedSingleLetterAliases.add(optionAlias);
    } else {
      optionAlias = undefined;
    }
    outObj[optionPath] = {
      alias: optionAlias,
      boolean: isBooleanJoiSchemaType(descriptionObj.type) || undefined,
      number: isNumberJoiSchemaType(descriptionObj.type) || undefined,
      string: isStringJoiSchemaType(descriptionObj.type) || undefined,
      description: descriptionObj?.flags?.description,
      default:
        // if provided via Prompt schema
        (getNestedObjPropFromKeyPathWithValue(newDefSettings, descriptionObj.argPath) as unknown) ??
        // from Joi schema
        descriptionObj?.flags?.default,
      demandOption:
        // required if marked as "required" and no default value (except for undefined) provided
        // TODO - turned off for now, seems to make problems (even if provided, there is an error about the option
        // being required
        //(descriptionObj?.flags?.presence === 'required' &&
        //  getNestedObjPropFromKeyPathWithValue(newDefSettings, descriptionObj.argPath) === undefined) ||
        undefined,
      normalize: (isStringJoiSchemaType(descriptionObj.type) && optionName.endsWith('FilePath')) || undefined,
    };
  });
  return outObj;
}

function convertObjectSchemaKeysDescriptionToSchemaYargsArgPartialDescriptions(
  newKeysDescription: JoiObjectSchemaKeysPartialDescription<PromptDataBaseSchema>,
) {
  const args: JoiObjectSchemaKeyYargsArgPartialDescription[] = [];
  const includeKeyInEvaluation = (objKeyVal: JoiObjectSchemaKeyPartialDescription) =>
    isObject(objKeyVal) && !!objKeyVal.type && !!objKeyVal?.flags?.description; // the key has a type and a description
  const argInclusionPredicate = (objKeyVal: JoiObjectSchemaKeyPartialDescription) => {
    return includeKeyInEvaluation(objKeyVal) && !isObjectJoiSchemaType(objKeyVal.type);
  };
  const argTransform = (objKeyVal: JoiObjectSchemaKeyPartialDescription, key: string, infoKeyPath: string[]) => {
    args.push({ ...objKeyVal, argPath: [...infoKeyPath, key] });
    return objKeyVal;
  };
  const inclusionOfKeyInArgPathPredicate = (objKeyVal: JoiObjectSchemaKeyPartialDescription, key: string) =>
    includeKeyInEvaluation(objKeyVal) && isObjectJoiSchemaType(objKeyVal.type);

  transformAllNestedObjPropsThatFulfillPredicate(
    newKeysDescription,
    argInclusionPredicate,
    argTransform,
    () => false,
    inclusionOfKeyInArgPathPredicate,
  );
  // - alternatives are converted to the first available primitive type
  // - non-primitive types are removed
  return convertJoiAlternativeSchemaDescriptionsToTheirSubSchemasIfPrimitiveOrRemove(args).filter((arg) =>
    isPrimitiveJoiSchemaType(arg.type),
  );
}

function filterOnlyAvailableTopLevelArgsFromParsedArgs(
  newArgv: Record<string, unknown>,
  newPartialDescriptions: JoiObjectSchemaKeyYargsArgPartialDescription[],
): Record<string, unknown> {
  const outObj: Record<string, unknown> = {};
  const availableTopLevelKeys = newPartialDescriptions.map((partialDescription) => partialDescription.argPath[0]);
  for (const argKey of Object.keys(newArgv)) {
    if (availableTopLevelKeys.includes(argKey)) outObj[argKey] = newArgv[argKey];
  }
  return outObj;
}

function mergeArgvSettingsAndDefSettings(
  newArgvSettings: PromptDataBaseDefSettings,
  newDefSettings: PromptDataBaseDefSettings,
): PromptDataBaseDefSettings {
  // removing those arg values that:
  // - are undefined or null
  // - are already provided in the default settings with a value different from undefined
  const redundantSettingsRemoved = transformAllNestedObjPropsThatFulfillPredicate(
    newArgvSettings,
    () => false,
    (objKeyVal) => objKeyVal,
    (objKeyVal, key, infoKeyPath) => objKeyVal == undefined,
    //(objKeyVal == undefined &&
    //getNestedObjPropFromKeyPathWithValue(newDefSettings, [...infoKeyPath, key]) !== undefined),
  );
  return mergeObjs(redundantSettingsRemoved, newDefSettings);
}

export function parseArguments(
  newCommandName: string,
  newPromptSchema: Joi.ObjectSchema<PromptDataBaseSchema>,
  newDefPromptSettings: PromptDataBaseDefSettings,
): PromptDataBaseDefSettings {
  const promptDataKeysDescription = getObjectSchemaKeysDescription<
    Joi.ObjectSchema<PromptDataBaseSchema>,
    PromptDataBaseSchema
  >(newPromptSchema);

  // filtered descriptions of schemas from every key
  const yargsPartialDescriptions =
    convertObjectSchemaKeysDescriptionToSchemaYargsArgPartialDescriptions(promptDataKeysDescription);
  const yargsOptionsObj = convertSchemaYargsArgPartialDescriptionsToYargsOptionsObj(
    yargsPartialDescriptions,
    newDefPromptSettings,
  );

  const argv = yargs(hideBin(process.argv))
    .scriptName(`npx ${CLI.binCommandName}`)
    .command(newCommandName, newDefPromptSettings.info || 'UNKNOWN command info', (yargs) => {
      yargs.options(yargsOptionsObj);
    })
    .help().argv;
  //.strict().argv; // TODO strict makes problems with camel-cased parameters

  const filteredArgv = filterOnlyAvailableTopLevelArgsFromParsedArgs(
    argv as Record<string, unknown>,
    yargsPartialDescriptions,
  ) as PromptDataBaseDefSettings;

  return mergeArgvSettingsAndDefSettings(filteredArgv, newDefPromptSettings);
}
