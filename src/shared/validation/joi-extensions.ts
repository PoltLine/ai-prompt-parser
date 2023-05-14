import JoiTemp from 'joi';
import { isUndefined } from '@shared/helpers/general';

// Re-exporting Joi declarations in namespace while preserving namespace
// https://github.com/microsoft/TypeScript/issues/4336
/**
 * Original Joi Root
 *
 */
export import Joi = JoiTemp;

/**
 * Partial type representing Joi's Object Schema's key when calling .describe() function on the schema
 *
 */
export type JoiObjectSchemaKeyPartialDescription = {
  type: string;
  flags: {
    [name: string]: unknown;
    default?: Joi.BasicType | Joi.Reference;
    description?: string;
  };
  allow?: Joi.BasicType[];
  rules: {
    [name: string]: unknown;
  };
  matches?: { schema: { type: string } }[];
};

export type JoiObjectSchemaKeysPartialDescription<TObj = Record<string, unknown>> = {
  [Key in keyof TObj]: JoiObjectSchemaKeyPartialDescription;
};

// Operations on schemas

export function isJoiSchema<TSchema extends Joi.ObjectSchema>(
  newSchema: TSchema | Joi.SchemaLike,
): newSchema is TSchema {
  return Joi.isSchema(newSchema);
}

export function convertSchemaToJoiSchema<TSchema extends Joi.ObjectSchema>(
  newSchema: TSchema | Joi.SchemaLike,
): TSchema {
  return isJoiSchema(newSchema) ? newSchema : (Joi.compile(newSchema) as TSchema);
}

export function isPrimitiveJoiSchemaType(newSchemaType: string) {
  return ['string', 'number', 'boolean'].includes(newSchemaType);
}

export function isObjectJoiSchemaType(newSchemaType: string) {
  return newSchemaType === 'object';
}

export function isBooleanJoiSchemaType(newSchemaType: string) {
  return newSchemaType === 'boolean';
}

export function isNumberJoiSchemaType(newSchemaType: string) {
  return newSchemaType === 'number';
}

export function isStringJoiSchemaType(newSchemaType: string) {
  return newSchemaType === 'string';
}

/**
 * Apply modification on schemas under the set of keys (top-level keys)
 *
 * @param newSchema existing Object schema
 * @param newKeys array of keys to modify
 * @returns the modified Object schema
 *
 */
export function applyModOnSchemasUnderKeys<TSchema extends Joi.ObjectSchema, TModel = any>(
  newSchema: TSchema,
  newKeys: (keyof TModel)[],
  newModOp: (schema: Joi.Schema) => Joi.Schema,
) {
  const modKeysObj: Joi.PartialSchemaMap = {};
  for (const modKey of newKeys) {
    modKeysObj[modKey] = newModOp(newSchema.extract(modKey as string));
  }
  return newSchema.keys(modKeysObj);
}

/**
 * Strip values of the specified keys
 * (keys will be marked as optional and their values will be stripped - turned undefined)
 *
 */
export function stripSchemasUnderKeys<TSchema extends Joi.ObjectSchema, TModel = any>(
  newSchema: TSchema,
  newKeys: (keyof TModel)[],
) {
  return applyModOnSchemasUnderKeys<TSchema, TModel>(newSchema, newKeys, (schema) => schema.optional().strip());
}

/**
 * Make values of the specified keys required
 * (can be used to turn optional defaults to required)
 *
 */
export function requireSchemasUnderKeys<TSchema extends Joi.ObjectSchema, TModel = any>(
  newSchema: TSchema,
  newKeys: (keyof TModel)[],
) {
  return applyModOnSchemasUnderKeys<TSchema, TModel>(newSchema, newKeys, (schema) => schema.required());
}

/**
 * Make schema required if default undefined or make it default if defined
 * (can be used to conditionally either use .default(...) or .required() - but never both at once!)
 *
 */
export function makeSchemaDefaultOrRequiredIfDefaultUndefined<
  TSchema extends Joi.Schema,
  TDefaultValue extends Parameters<TSchema['default']>[0] = Parameters<TSchema['default']>[0],
>(newSchema: TSchema, newDefaultValue: TDefaultValue) {
  return isUndefined(newDefaultValue) ? newSchema.required() : newSchema.default(newDefaultValue);
}

/**
 * Function that remaps the object schema into a non-Joi version of object with keys only
 *
 */
export function getObjectSchemaKeysDescription<TSchema extends Joi.ObjectSchema, TObj = unknown>(
  newSchema: TSchema,
): JoiObjectSchemaKeysPartialDescription<TObj> {
  return {
    ...(
      newSchema.describe() as Joi.Description & {
        keys: JoiObjectSchemaKeysPartialDescription<TObj>;
      }
    ).keys,
  };
}
