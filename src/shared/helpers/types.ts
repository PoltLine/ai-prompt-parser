/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */

// ////////
// Helpers MUST have no environment-dependent imports !!!
// ////////

// basic types
/**
 * Interface for normal indexable object with string keys
 * (Array object would also be matched)
 * (better to use Record<string, unknown>)
 *
 */
export interface PropertiesObj {
  [key: string]: any;
}

/**
 * Interface for normal indexable object with string keys and string values
 *
 */
export interface StringPropertiesObj {
  [key: string]: string;
}

export type AnyFunction<A = any> = (...input: any[]) => A;
export type AnyConstructor<A = object> = new (...input: any[]) => A;
export type AnyConstructorAbstract<A = object> = abstract new (...input: any[]) => A;
