/* eslint-disable @typescript-eslint/no-explicit-any */

// ////////
// Helpers MUST have no environment-dependent imports !!!
// ////////

import { PropertiesObj } from './types';

/**
 * Function that checks if the parameter is undefined
 *
 */
export function isUndefined(newInput: any): boolean {
  return typeof newInput === 'undefined';
}

/**
 * Function that checks if the parameter is NOT undefined
 *
 */
export function isNotUndefined(newInput: any): boolean {
  return !isUndefined(newInput);
}

/**
 * Function that checks if the type of the input value is a boolean
 *
 */
export function isBoolean(newInput: any): newInput is boolean {
  return typeof newInput === 'boolean';
}

/**
 * Function that checks if the parameter is a default javascript object
 * - e.g. {}, {a : 2}, new Object(), ...
 *
 *
 * There are other (newer) methods to check:
 * https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
 * - this however does not seem to work as well as the .toString method used in this function
 *
 */
export function isObject(newInput: any): newInput is PropertiesObj {
  return Object.prototype.toString.call(newInput) === '[object Object]';
}

/**
 * Function that checks if the parameter is a default javascript non-empty (has it own keys/properties) object
 * https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 *
 */
export function isNonEmptyObject(newInput: any): boolean {
  return isObject(newInput) && Object.keys(newInput).length > 0;
}

/**
 * Function that checks if the parameter is a default javascript empty (has no own keys/properties) object
 * https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 *
 */
export function isEmptyObject(newInput: any): boolean {
  return (
    isObject(newInput) && Object.keys(newInput).length === 0 && Object.getPrototypeOf(newInput) === Object.prototype
  );
}

/**
 * Function that checks if the parameter is a an Array
 *
 */
export function isArray(newInput: any): boolean {
  return Object.prototype.toString.call(newInput) === '[object Array]';
}

/**
 * Function that checks if the parameter is a Function
 *
 */
export function isFunction(newInput: any): boolean {
  return typeof newInput === 'function';
}

/**
 * Function that checks if the parameter is a string (static string, not String object)
 *
 */
export function isString(newInput: any): newInput is string {
  return typeof newInput === 'string';
}

/**
 * Conversion of 'Yes' / 'No' string to bool (case-insensitive)
 * - check is done only for 'yes' (== true), everything else is false
 *
 */
export function strToBool(newStr: string): boolean {
  return newStr.trim().toLowerCase() === 'yes';
}

/**
 * Conversion of true / false bool to integer (1 / 0)
 *
 */
export function boolToInt(newBool: boolean): number {
  return newBool ? 1 : 0;
}

/**
 * Conversion of integer (1 / 0) to true / false (bool)
 * - function also takes every number (not just 1) as true
 *
 */
export function intToBool(newInt: number): boolean {
  return newInt === 0 ? false : true;
}

/**
 * Function that does:
 * 1) a TRIM operation on a string,
 * 2) converts all different whitespace characters to a space ' '
 *    (which removes maybe unwanted tabs and non-breaking spaces),
 * 3) and also converts multiple Whitespace characters to exactly ONE space character (" ")
 *
 */
export function trimAndReplaceWhitespacesWithSpacesAndConvertMultipleToSingleWhitespace(newStr: string): string {
  return convertMultipleToSingleWhitespace(replaceWhitespacesWithSpaces(newStr.trim()));
}

/**
 * Function that does a TRIM operation on a string and also converts multiple Whitespace characters to
 * exactly ONE space character (" ")
 *
 */
export function trimAndConvertMultipleToSingleWhitespace(newStr: string): string {
  return convertMultipleToSingleWhitespace(newStr.trim());
}

/**
 * Function that converts multiple Whitespace characters to exactly ONE space character (" ")
 *
 */
export function convertMultipleToSingleWhitespace(newStr: string): string {
  return newStr.replace(/\s{2,}/g, ' ');
}

/**
 * Function that replaces every whitespace with a replacement
 * - whitespace is considered as \s character in Javascript regex which matches multiple different types whitespaces
 *   (including a non-breaking space, newline, ...)
 *
 */
export function replaceWhitespaces(newStr: string, newReplacementStr: string): string {
  return newStr.replace(/\s/g, newReplacementStr);
}

/**
 * Function that replaces every whitespace with a space ' '
 *
 */
export function replaceWhitespacesWithSpaces(newStr: string): string {
  return replaceWhitespaces(newStr, ' ');
}

/**
 * Function that removes every whitespace
 *
 */
export function removeWhitespaces(newStr: string): string {
  return replaceWhitespaces(newStr, '');
}

/**
 * Function that converts the input string to lowercase (e.g. to unify comparisons for case-insensitive comparing) on
 * condition
 *
 * @param newEnable boolean that can be used as conditional activation of this function
 * - if false, no conversion is done, the provided string is returned as is without modification
 */
export function convertToLowerCase(newStr: string, newEnable = true): string {
  return newEnable ? newStr.toLowerCase() : newStr;
}

/**
 * Function that converts all single LF byte sequences (not when appearing as CRLF) to CRLF
 *
 */
export function convertLFtoCRLF(newStr: string): string {
  return newStr.replace(/(?<!\r)\n/g, '\r\n');
}

/**
 * Function that encloses/surrounds the provided string with the same starting and ending string (e.g. a quote)
 *  - check is done only for 'yes' (== true), everything else is false
 *
 * @param newEnable boolean that can be used as conditional activation of this function
 * - if false, no enclosing is done, the provided string is returned as is without modification
 * @param escapeQuotes boolean that also adds quote escaping
 * - this is used ONLY if newEnable === true
 *
 */
export function encloseInStrs(
  newStr: string,
  newEnable = true,
  newSurroundingStr = "'",
  newEscapeQuotes = false,
): string {
  let modStr = newStr;
  if (newEnable) {
    modStr = `${newSurroundingStr}${newStr}${newSurroundingStr}`;
    if (newEscapeQuotes) {
      modStr = escapeQuotes(modStr);
    }
  }
  return modStr;
}

export function singleQuoteStr(newStr: string, newEnable = true, escapeQuotes = false): string {
  return encloseInStrs(newStr, newEnable, "'", escapeQuotes);
}

export function backQuoteStr(newStr: string, newEnable = true, escapeQuotes = false): string {
  return encloseInStrs(newStr, newEnable, '`', escapeQuotes);
}

/**
 * Function that encloses/surrounds the provided string in an opening and closing HTML tag
 *
 */
export function encloseInOpeningAndClosingHtmlTag(newStr: string, newTag: string): string {
  return `<${newTag}>${newStr}</${newTag}>`;
}

export function escapeQuotes(newStr: string): string {
  // escaping both double and single quotes inside string
  return newStr.replace(/"/g, '\\"').replace(/'/g, "\\'");
}

/**
 * Function that checks if the provided string is a valid JS identifier
 * - simplified JS identifier check
 *
 */
export function isJSIdentifier(newIdentifierStr: string): boolean {
  return /^[a-zA-Z$_][a-zA-Z0-9_]*$/.test(newIdentifierStr);
}

/**
 * Function that capitalizes each word in the string
 * - and makes all the other characters lowercase
 *
 */
export function capitalizeEachWord(newStr: string): string {
  return newStr.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Function that capitalizes only the first word in the string
 *
 */
export function capitalizeFirstWord(newStr: string): string {
  return newStr.replace(/\w\S*/, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Function that returns a generator of numbers in integer sequence
 *
 */
export function intSeqGeneratorFactory(newCounterStartingVal = 0) {
  let actID = newCounterStartingVal; // starting ID
  function getNext() {
    return actID++;
  }
  function reset(newCounterStartingVal = 0) {
    // we can reset the counter if needed
    actID = newCounterStartingVal;
  }
  return {
    getNext: getNext,
    reset: reset,
  };
}

/**
 * Function that returns a generator of unique IDs (strings)
 *
 */
export function uniqueIDGeneratorFactory(newCounterStartingVal = 0) {
  const intSeqGenerator = intSeqGeneratorFactory(newCounterStartingVal);

  return {
    getNext: (newPrefix = '') => {
      return `${newPrefix}${intSeqGenerator.getNext()}`;
    },
    reset: intSeqGenerator.reset,
  };
}

export type IntSeqGenerator = ReturnType<typeof intSeqGeneratorFactory>;
export type UniqueIDGenerator = ReturnType<typeof uniqueIDGeneratorFactory>;

/**
 * Function to generate a random number from MIN (default 0) to MAX (default max integer)
 *
 */
export function getRandomIntFromMinToMax(newMin = 0, newMax = Number.MAX_SAFE_INTEGER) {
  newMin = Math.ceil(newMin);
  newMax = Math.floor(newMax);
  return Math.floor(Math.random() * (newMax - newMin) + newMin);
  // the maximum is exclusive and the minimum is inclusive
}

/**
 * Function to generate a random number from 0 to MAX (default max integer)
 *
 */
export function getRandomInt(newMax = Number.MAX_SAFE_INTEGER): number {
  return getRandomIntFromMinToMax(0, newMax);
}

/**
 * Function which (instead of our manual change) inserts escape slashes in order to create a dynamic regular expression
 * from a string
 * - this is not necessary when using a RegExp literal only when we want to create regular expression out of a string
 *   literal
 * https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#comment14461662_6969486
 *
 */
export function escapeRegExpStr(newStr: string): string {
  return newStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // '$&' represents "whole MATCHED string"
}

/**
 * Function that removes doubled backslashes from a string
 * - e.g. 'styles\\\\n..+1' -> '"styles\\n..+1'
 * - can be used when e.g. providing a file path from cmd to NPM script and this doubles the backslashes before adding
 *   it as an argument to the program
 *
 */
export function unescapeRegExpStrBackslashes(newStr: string): string {
  return newStr.replace(/\\\\/g, '\\');
}

/**
 * Creates a regex string to search for a substring that STARTs with a start_mark and ENDs with an end_mark while
 * requiring that NO start_mark appears between the two
 * - matching group 1 contains the contents enclosed by the start_mark and end_mark (+ the 'afterStart' and 'beforeEnd'
 *   regexes - these also do not belong in the matching group, they are used only as parts of the enclosing marks)
 *   - this applies if afterStartMarkRegexStr does not contain parentheses
 *
 * - originally used special 's' (dotall) flag for Regex creation
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll
 *   - later switched to '[\s\S]' not to require a special flag
 *
 * - e.g. start_mark='<div>' and end_mark='</div>' will find all '<div>...</div>' where '...' can contain everything
 *   other than '<div>'
 *
 */
export function getEnclosedInStartAndEndMarkRegexStr(
  newStartMarkStr: string,
  newEndMarkStr: string,
  newAfterStartMarkRegexStr = '',
  newBeforeEndMarkRegexStr = '',
): string {
  return `${escapeRegExpStr(newStartMarkStr)}${newAfterStartMarkRegexStr}(((?!${escapeRegExpStr(
    newStartMarkStr,
  )})[\\s\\S])*)${newBeforeEndMarkRegexStr}${escapeRegExpStr(newEndMarkStr)}`;
  // needs to be '[\\s\\S]' as we are generating a string here, not a regex directly
}

/**
 * Creates a regex that will search globally for all substrings that START with a start_mark and END with an end_mark
 * while requiring that NO start_mark appears between the two
 * - matching group 1 contains the contents enclosed by the start_mark and end_mark (+ the 'afterStart' and 'beforeEnd'
 *   regex - these also do not belong in the matching group, they are used only as parts of the enclosing marks)
 *   - this applies if afterStartMarkRegexStr does not contain parentheses
 *
 * uses {@link getEnclosedInStartAndEndMarkRegexStr} function to generate the regex string
 *
 * @param newGlobal adds the 'g' flag to the regular expression, this changes the behavior of the regex when matching
 * against it !!!
 *
 */
export function getEnclosedInStartAndEndMarkRegex(
  newStartMarkStr: string,
  newEndMarkStr: string,
  newAfterStartMarkRegexStr = '',
  newBeforeEndMarkRegexStr = '',
  newGlobal = true,
  newIgnoreCase = false,
): RegExp {
  return new RegExp(
    getEnclosedInStartAndEndMarkRegexStr(
      newStartMarkStr,
      newEndMarkStr,
      newAfterStartMarkRegexStr,
      newBeforeEndMarkRegexStr,
    ),
    (newGlobal ? 'g' : '') + (newIgnoreCase ? 'i' : ''),
  );
}

/**
 * Creates a regex that will search globally for all substrings (case-INsensitive) that START with an HTML opening_tag
 * and END with the same HTML closing_tag while requiring that NO opening_tag appears between the two
 * - matching group 1 contains the contents enclosed by the opening_tag and closing_tag (+ the 'afterStart' and
 *   'beforeEnd' regex - these also do not belong in the matching group, they are used only as parts of the enclosing
 *    marks)
 *   - this applies if afterStartMarkRegexStr does not contain parentheses
 *
 * CONTAINS 'g' global flag !!! + 'i' (case-insensitive)
 *
 */
export function getEnclosedInOpeningAndClosingHtmlTagRegex(
  newTag: string,
  newAfterOpeningTagRegexStr = '',
  newBeforeClosingTagRegexStr = '',
): RegExp {
  return getEnclosedInStartAndEndMarkRegex(
    `<${newTag}>`,
    `</${newTag}>`,
    newAfterOpeningTagRegexStr,
    newBeforeClosingTagRegexStr,
    true,
  );
}

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
export function getHtmlBRTagRegexStr(): string {
  return `<\\/?br\\\\?>`; // <br>, </br>, <br\>, <br \>, </br \>
}

/**
 * Creates a regex that will search globally for all substrings (case-INsensitive) that represent HTML "BR"
 * (line break) tags
 *
 * CONTAINS 'g' global flag !!! + 'i' (case-insensitive)
 */
export function getHtmlBRTagRegex(): RegExp {
  return new RegExp(getHtmlBRTagRegexStr(), 'gi');
}

/**
 * Creates a regex that will search globally for all substrings (case-INsensitive) that represent "empty" HTML pair
 * (== with both opening and closing tag) tags
 * - a pair is considered "empty" when it contains only whitespaces and optionally <br> tags between the opening and
 *   closing tag
 *
 * @param newTagList a list of HTML tags
 * - e.g. ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'b', 'i', 'br']
 *    - this will generate ONE regex that will search for all these tags' "empty" pairs:
 *       - h1-s that have a form like '<h1></h1>', '<h1>  </h1>', '<h1> <br> </h1>' (if BRs are included by parameter)
 *         but NOT '<h1>a</h1>'
 *       - h2-s that have a form like '<h2></h2>', '<h2>  </h2>', '<h2> <br> </h2>' (if BRs are included by parameter)
 *         but NOT '<h2>a</h2>'
 *       - ... the same for 'h3', 'h4', ... 'br' ('br's will be automatically excluded - they are not pair tags)
 * @param newConsiderBRTagsEmpty will lead to ignoring '<br>' tags inside tag pairs, so tags containing <br>s (or
 * whitespace) will be considered "empty" tags
 *
 * CONTAINS 'g' global flag !!! + 'i' (case-insensitive)
 *
 */
export function getHtmlEmptyTagsRegex(newTagList: string[], newConsiderBRTagsEmpty = false): RegExp {
  return new RegExp(
    newTagList
      .filter((tag) => tag !== 'br') // we omit 'br' tags
      .map((tag) => {
        const escapedTag = escapeRegExpStr(tag);
        return `(<${escapedTag}>(\\s${newConsiderBRTagsEmpty ? `|${getHtmlBRTagRegexStr()}` : ''})*<\\/${escapedTag}>)`;
      })
      .join('|'),
    'gi',
  );
}

/**
 * Creates a regex that will match a URL of files with the provided extensions
 * - matching group 1 contains the used extension
 *
 * CONTAINS 'i' flag !!!
 * DOES NOT CONTAIN 'g' global flag !!!
 *
 */
export function getFileUrlWithExtensionsRegex(newAllowedExtensions: string[]) {
  return new RegExp(`^.+\\.(${newAllowedExtensions.map((ext) => escapeRegExpStr(ext)).join('|')})$`, 'i');
}

/**
 * Function that calls str.replace(str_or_regex, replacement_or_replacer_function) on a list of replace tuples
 * - replacing one after another
 *
 * @returns the final string that is a result of replacing all the provided tuples in sequence
 *
 */
export function replaceMore(
  newStr: string,
  newReplaceTuples: [string | RegExp, string | ((substring: string, ...args: any[]) => string)][],
): string {
  let outStr: string = newStr;
  for (const [strOrRegExp, replacementOrReplacer] of newReplaceTuples) {
    outStr = outStr.replace(strOrRegExp, replacementOrReplacer as string);
    // 'string' here provided as replace function is an overloaded function and there was no easy way to force the type
    // of replacementOrReplacer from union type (as parameters are taken from a list) serving all overloads
  }
  return outStr;
}

/**
 * Function that returns the first element of an array
 * - if there are no elements in the array, null is returned
 *
 */
export function getFirstElemOfArray(newArray: any[]): any {
  return newArray.length > 0 ? newArray[0] : null;
}

/**
 * Function that returns the last element of an array
 * - if there are no elements in the array, null is returned
 *
 */
export function getLastElemOfArray<T = any>(newArray: T[]): T | null {
  return newArray.length > 0 ? newArray[newArray.length - 1] : null;
}

/**
 * Function that returns a copy of array without its last element
 * - if there are no elements in the array, the array is returned as is == empty
 *
 */
export function getArrayWithoutLastElem(newArray: any[]): any[] {
  return newArray.length > 0 ? newArray.slice(0, -1) : [];
}

/**
 * Function combining {@link getLastElemOfArray} and {@link getArrayWithoutLastElem} functions
 *
 * @returns object with results of both functions
 */
export function separateLastElemFromArray(newArray: any[]): { last: any; array: any[] } {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { last: getLastElemOfArray(newArray), array: getArrayWithoutLastElem(newArray) };
}

/**
 * Function that returns an intersection of arrays
 * https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
 *
 */
export function getArraysIntersection<T>(newSourceArray: T[], newTargetArray: T[]): T[] {
  return newSourceArray.filter((x) => newTargetArray.includes(x));
}

/**
 * Function that returns a difference of arrays
 * https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
 *
 */
export function getArraysDifference<T>(newSourceArray: T[], newTargetArray: T[]): T[] {
  return newSourceArray.filter((x) => !newTargetArray.includes(x));
}

/**
 * Function that splits a string into 2 substrings (left and right) based on the provided index
 * - e.g. 'car drives' split at index 3 (+ omiting 1 char from right) returns left:'car' and right:'drives'
 * @param omitFirstNumberOfCharsFromRight number of characters omitted from the right part (so that, if we are spliting
 * at a space/separator, we leave the separator out)
 */
export function splitStrOnIndex(
  newStr: string,
  newIndex: number,
  omitFirstNumberOfCharsFromRight = 0,
  trimSubstrings = false,
): { left: string; right: string } {
  let left = newStr.substring(0, newIndex);
  let right = newStr.substring(newIndex + omitFirstNumberOfCharsFromRight);
  if (trimSubstrings) {
    left = left.trim();
    right = right.trim();
  }
  return { left: left, right: right };
}

/**
 * Function to generate a path string from array looking like: 'A' -> 'B' -> 'C'
 *
 */
export function formatArrayToPathStr(newPathArray: string[]) {
  return newPathArray.map((elem) => `${singleQuoteStr(elem)}`).join(' -> ');
}

/**
 * Function that traverses the provided object and finds all values key paths to properties that fulfill the given
 * predicate
 * - function that extracts all possible key paths that can be put in
 *   {@link extractAllNestedObjPropsOnTheGivenPropKeyPathsThatFulfillPredicateIntoArray}
 *
 * @param newCompObj complete object to search through
 * @param newPredicate a predicate function that returns true/false for the value of keys (last key) on the path -
 * based on that we know we are on the last level/depth of the path
 * @returns an array of arrays (one for each key path)
 */
export function extractAllNestedObjPropKeyPathsThatLeadToPropsThatFulfillPredicateIntoArray(
  newCompObj: PropertiesObj,
  newPredicate: (newObj: PropertiesObj) => boolean,
  newKeyUnderWhichToSaveInfoKeyPath: string,
): string[][] {
  const resArray: string[][] = [];
  // finding all actions from the configuration
  const allActions = extractAllNestedObjPropsOnTheGivenPropKeyPathsThatFulfillPredicateIntoArray(
    newCompObj,
    Object.keys(newCompObj).map((key) => [key]), // we insert all top-level keys
    newPredicate,
    newKeyUnderWhichToSaveInfoKeyPath,
  );
  let actionKeyPath: string[];
  for (const action of allActions) {
    actionKeyPath = action[newKeyUnderWhichToSaveInfoKeyPath] as string[];
    for (let i = 0; i < actionKeyPath.length; i++) {
      const actionPartialKeyPath = actionKeyPath.slice(0, i + 1);
      let alreadyIncluded = false;
      for (const element of resArray) {
        if (compareArrays(element, actionPartialKeyPath)) {
          alreadyIncluded = true;
        }
      }
      if (!alreadyIncluded) {
        resArray.push(actionPartialKeyPath);
      }
    }
  }

  return resArray;
}

/**
 * Function that traverses the provided object and finds all values (that fulfill the given predicate) of keys (that
 * fulfill any of the provided key paths)
 *
 * @param newCompObj complete object to search through
 * @param newKeyPaths an array of arrays of strings - e.g. [['proplv1', 'proplv2', 'proplv3'],
 * ['proplv1', 'prop2lv2']] represents a nesting in the object like
 * {'proplv1' : {'proplv2': {'proplv3': {...}}, 'prop2lv2' : {...}}}
 * @param newPredicate a predicate function that returns true/false for the value of keys (last key) on the path -
 * based on that the value of the key will be added into the resulting array
 * @param newKeyUnderWhichToSaveInfoKeyPath if we want, we can provide a key (e.g. 'id') that will be used to save
 * the keys (the path of keys in the analyzed object) of the item that fulfills the predicate
 * @returns an array of objects that fulfill the predicate
 */
export function extractAllNestedObjPropsOnTheGivenPropKeyPathsThatFulfillPredicateIntoArray(
  newCompObj: PropertiesObj,
  newKeyPaths: string[][],
  newPredicate: (newObj: PropertiesObj) => boolean,
  newKeyUnderWhichToSaveInfoKeyPath?: string,
): PropertiesObj[] {
  let resArray: PropertiesObj[] = [];
  for (const keyPath of newKeyPaths) {
    resArray = resArray.concat(
      extractAllNestedObjPropsOnTheGivenPropKeyPathThatFulfillPredicateIntoArray(
        newCompObj,
        [...keyPath], // we create a copy of array
        newPredicate,
        newKeyUnderWhichToSaveInfoKeyPath,
      ),
    );
  }

  return resArray;
}

/**
 * Function that traverses the provided object and finds all values (that fulfill the given predicate) of keys (that
 * fulfill the provided key path)
 *
 * @param newCompObj complete object to search through
 * @param newKeyPath an array of strings - e.g. ['proplv1', 'proplv2', 'proplv3'] represents a nesting in the object
 * like {'proplv1' : {'proplv2': {'proplv3': {...}}}}
 * @param newPredicate a predicate function that returns true/false for the value of keys on the path - based on that
 * the value of the key will be added into the resulting array
 * @param newKeyUnderWhichToSaveInfoKeyPath if we want, we can provide a key (e.g. 'id') that will be used to save
 * the keys (the path of keys in the analyzed object) of the item that fulfills the predicate
 * @param newInfoKeyPathStart the starting array for the info key path saved under key from
 * 'newKeyUnderWhichToSaveInfoKeyPath' param
 * @returns an array of objects that fulfill the predicate
 */
export function extractAllNestedObjPropsOnTheGivenPropKeyPathThatFulfillPredicateIntoArray(
  newCompObj: PropertiesObj,
  newKeyPath: string[],
  newPredicate: (newObj: PropertiesObj) => boolean,
  newKeyUnderWhichToSaveInfoKeyPath?: string,
  newInfoKeyPathStart: string[] = [],
): PropertiesObj[] {
  let resArray: PropertiesObj[] = [];
  const keyPath = newKeyPath;
  // we go over every given property path
  const currentPathKey = keyPath.shift();
  // if nothing can be shifted, array stays empty and 'currentPropPathKey' will be undefined
  for (const key of Object.keys(newCompObj)) {
    if (Object.prototype.hasOwnProperty.call(newCompObj, key)) {
      const currentObjKeyVal = newCompObj[key] as PropertiesObj;
      const currentObjKeyValFulfillsPredicate = newPredicate(currentObjKeyVal);

      if (isNotUndefined(currentPathKey) && currentPathKey !== key) {
        // we are on a different key path
        continue;
      } else if (
        // we are not yet at the end of the analyzed key path
        (currentPathKey === key && keyPath.length > 0) ||
        // we are at the end of the analyzed path, but not at an item that fulfills predicate
        (currentPathKey === key && !currentObjKeyValFulfillsPredicate) ||
        // we are deeper than the end of the analyzed path, but not at an item that fulfills predicate
        (isUndefined(currentPathKey) && !currentObjKeyValFulfillsPredicate)
      ) {
        // we are already on the path (or deeper)
        if (isObject(currentObjKeyVal)) {
          resArray = resArray.concat(
            extractAllNestedObjPropsOnTheGivenPropKeyPathThatFulfillPredicateIntoArray(
              currentObjKeyVal,
              keyPath, // key path without the first element
              newPredicate,
              newKeyUnderWhichToSaveInfoKeyPath,
              newInfoKeyPathStart.concat([key]),
            ),
          );
        } else {
          continue;
        }
      } else if (currentObjKeyValFulfillsPredicate) {
        // we are at the end or deeper on the analyzed key path and found an item that fulfills the predicate
        // we create a copy of object
        const objKeyValCopy = { ...currentObjKeyVal };
        if (isNotUndefined(newKeyUnderWhichToSaveInfoKeyPath)) {
          objKeyValCopy[newKeyUnderWhichToSaveInfoKeyPath as string] = newInfoKeyPathStart.concat([key]);
        }
        resArray.push(objKeyValCopy);
      }
    }
  }

  return resArray;
}

/**
 * Function that traverses the provided object and finds all values that fulfill the given predicate and applies
 * the transform on them
 * - creates a new object
 *
 * @param newCompObj complete object to search through
 * @param newPredicate a predicate function that returns true/false for the value of keys on the path - based on that
 * the value of the key will be transformed
 * @param newTransform a transform function for the value that fulfills the predicate to transform it
 * (does not automatically create new copies if objects, could influence the original objects)
 * @param newIgnoreWhenPredicate a predicate function that returns true/false for the value of keys on the path - based
 * on that will the key will be ignored
 * - if true, newPredicate or newTransform will not be applied (ignoring happens before checking the original predicate)
 * @returns a new object with modifications
 */
export function transformAllNestedObjPropsThatFulfillPredicate<TResult = PropertiesObj>(
  newCompObj: PropertiesObj,
  newPredicate: (newObjKeyVal: any, newKey: string, newInfoKeyPath: string[]) => boolean,
  newTransform: (newObjKeyVal: any, newKey: string, newInfoKeyPath: string[]) => any,
  newIgnoreWhenPredicate: (newObjKeyVal: any, newKey: string, newInfoKeyPath: string[]) => boolean = () => false,
  // the key will be saved into path only if predicate true
  newSaveInfoKeyIntoPathPredicate: (newObjKeyVal: any, newKey: string) => boolean = () => true,
  newInfoKeyPathStart: string[] = [],
): TResult {
  const outputObj: PropertiesObj = {};
  for (const key of Object.keys(newCompObj)) {
    if (Object.prototype.hasOwnProperty.call(newCompObj, key)) {
      const currentObjKeyVal = newCompObj[key] as PropertiesObj;
      const currentObjKeyValFulfillsPredicate = newPredicate(currentObjKeyVal, key, newInfoKeyPathStart);
      const currentObjKeyValFulfillsIgnorePredicate = newIgnoreWhenPredicate(
        currentObjKeyVal,
        key,
        newInfoKeyPathStart,
      );
      if (currentObjKeyValFulfillsIgnorePredicate) continue;
      else if (currentObjKeyValFulfillsPredicate) {
        // if the predicate is fulfilled on an object (with keys of its own), this object will not be traversed anymore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        outputObj[key] = newTransform(currentObjKeyVal, key, newInfoKeyPathStart);
      } else if (isObject(currentObjKeyVal)) {
        outputObj[key] = transformAllNestedObjPropsThatFulfillPredicate<TResult>(
          currentObjKeyVal,
          newPredicate,
          newTransform,
          newIgnoreWhenPredicate,
          newSaveInfoKeyIntoPathPredicate,
          [...newInfoKeyPathStart, ...(newSaveInfoKeyIntoPathPredicate(currentObjKeyVal, key) ? [key] : [])],
        );
      } else {
        outputObj[key] = currentObjKeyVal;
      }
    }
  }

  return outputObj as TResult;
}

export function mergeObjs(newSourceObj: PropertiesObj, newTargetObj: PropertiesObj): PropertiesObj {
  for (const [key, val] of Object.entries(newSourceObj)) {
    if (isObject(val)) {
      if (newTargetObj[key] === undefined) {
        newTargetObj[key] = {};
      }
      mergeObjs(val, newTargetObj[key] as PropertiesObj);
    } else {
      newTargetObj[key] = val as unknown;
    }
  }
  return newTargetObj; // the original target object modified
}

/**
 * Function to retrieve an element/item of array that fulfills the predicate
 *
 * @param newPredicate predicate function that returns true/false for the item of array (which is its only parameter)
 * @returns tuple [index, elem] of the first element that fulfills the predicate or null if no such element is found
 */
export function getElemFromArrayThatFulfillsPredicate<T>(
  newArray: T[],
  newPredicate: (newAnalyzedElem: T) => boolean,
): [number, T] | null {
  for (let i = 0; i < newArray.length; i++) {
    const elem = newArray[i];
    if (newPredicate(elem)) {
      return [i, elem];
    }
  }
  return null;
}

/**
 * Function that compares two Arrays
 *
 */
export function compareArrays(newA: any[], newB: any[]): boolean {
  return JSON.stringify(newA) === JSON.stringify(newB);
}

/**
 * Function that sorts objects by keys
 * - function returns a new object
 *
 * @param newTopLevelKeysToIgnoreInOutputObj top (in nested objects keys cannot be ignored) level keys to ignore
 * @param newTopLevelKeysToIncludeInOutputObj top (in nested objects keys cannot be influenced) level keys to include
 * - if falsy, all keys will be included
 * - ignoring (exclusion) happens after inclusion, so included keys can still be ignored
 *
 */
export function sortObject<TObj extends PropertiesObj>(
  newObj: TObj,
  newTopLevelKeysToIgnoreInOutputObj: (keyof TObj)[] = [],
  newTopLevelKeysToIncludeInOutputObj?: (keyof TObj)[],
): TObj {
  if (!newObj) {
    return newObj;
  }

  const output: TObj = {} as TObj;
  Object.keys(newObj)
    .sort()
    .forEach(function (k) {
      if (newTopLevelKeysToIncludeInOutputObj && !newTopLevelKeysToIncludeInOutputObj.includes(k)) {
        return;
      }
      if (newTopLevelKeysToIgnoreInOutputObj.includes(k)) {
        return;
      } else if (isObject(newObj[k])) {
        // for deeper recursion we always set ignored keys to empty array - only top level keys can be ignored
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        output[k as keyof TObj] = sortObject(newObj[k], []);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        output[k as keyof TObj] = newObj[k];
      }
    });
  return output;
}

export const alwaysTruePredicate = () => {
  return true;
};

export const alwaysFalsePredicate = () => {
  return false;
};

/**
 * Function that compares two objects
 *
 * @param newKeysToIgnoreWhenComparingObjs an array of string keys to ignore when comparing objects - these will be
 * ignored/removed in both objects if they exist there
 * @param newIgnoreKeysPredicate if this predicate returns true for any of the provided objects, only then the keys
 * from 'newKeysToIgnoreWhenComparingObjs' will be ignored inside this object
 * - by default the predicate is a function that always returns true (provided array of keys will always be ignored
 *   in both objects - no matter the objects provided)
 */
export function compareObjs(
  newA: PropertiesObj,
  newB: PropertiesObj,
  newKeysToIgnoreWhenComparingObjs: (keyof PropertiesObj)[] = [],
  newIgnoreKeysPredicate: (newObj: PropertiesObj) => boolean = alwaysTruePredicate,
): boolean {
  return (
    JSON.stringify(sortObject(newA, newIgnoreKeysPredicate(newA) ? newKeysToIgnoreWhenComparingObjs : [])) ===
    JSON.stringify(sortObject(newB, newIgnoreKeysPredicate(newB) ? newKeysToIgnoreWhenComparingObjs : []))
  );
}

/**
 * Function that checks if the key is among own properties of the object
 *
 */
export function hasOwnPropertyKey(newObj: PropertiesObj, newKey: string | number): boolean {
  return Object.prototype.hasOwnProperty.call(newObj, newKey);
}

/**
 * Function that checks if the key is among own properties of the object
 *
 */
export function getKeysFromSourceObjNotInTargetObj(newSourceObj: PropertiesObj, newTargetObj: PropertiesObj): string[] {
  const resArray: string[] = [];
  for (const key of Object.keys(newSourceObj)) {
    // we iterate over all 'own' enumerable properties
    if (!hasOwnPropertyKey(newTargetObj, key)) {
      resArray.push(key);
    }
  }

  return resArray;
}

/**
 * Function that takes as parameters an object and an array of tuples formed as: [[predicate, value], ...]
 * and returns the value of the first tuple from the array where the predicate is fulfilled on the object
 * - if no such predicate exists, null is returned
 *
 * @param newPredicateTupleArray an array of tuples [predicate, value]
 *
 */
export function getValueOfFirstFulfilledPredicateTuple<ObjT extends PropertiesObj>(
  newObj: ObjT,
  newPredicateTupleArray: [(newObj: ObjT) => boolean, (keyof ObjT)[]][],
) {
  for (const [predicate, value] of newPredicateTupleArray) {
    if (predicate(newObj)) {
      return value;
    }
  }
  return null;
}

/**
 * Function that checks if one array is a prefix-array (the same as prefix for a string) of another array
 * - e.g. ['a', 'b', 'c'] array's prefix can be:
 *   - []
 *   - ['a']
 *   - ['a', 'b']
 *   - ['a', 'b', 'c']
 *
 */
export function isArrayPrefixOf(newSubArray: any[], newArray: any[]) {
  if (newSubArray.length > newArray.length) {
    // if the sub-array is longer than the original array, it cannot be a prefix
    return false;
  }
  for (let i = 0; i < newSubArray.length; i++) {
    if (newSubArray[i] !== newArray[i]) {
      // if any of the elements of sub-array differs from the original array, it cannot be a prefix
      return false;
    }
  }
  return true;
}

/**
 * Function that applies {@link isArrayPrefixOf} function to an array of arrays
 * - if the sub-array is a prefix of any of the arrays, the result is true, else false
 *
 */
export function isArrayPrefixOfAnyOfArrays(newSubArray: any[], newArrays: any[][]) {
  for (const array of newArrays) {
    if (isArrayPrefixOf(newSubArray, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Function that finds all sub-array prefixes of existing arrays inside a list of arrays and removes them
 * - this should leave the list with only unique arrays
 *
 */
export function removeAllArrayPrefixesOfExistingArraysInArrayList(newArrays: any[][]) {
  // we sort the arrays - longest first
  const sortedArraysLongestFirst = [...newArrays].sort((a, b) => a.length - b.length).reverse();
  const outFilteredArrays: any[][] = [];
  for (const array of sortedArraysLongestFirst) {
    if (isArrayPrefixOfAnyOfArrays(array, outFilteredArrays)) {
      // this array is a prefix of already added array, we filter it out
    } else {
      // this array is not a prefix, we can add it to the output list
      outFilteredArrays.push(array);
    }
  }

  // we preserve the original order, so we resort by index in the original array
  return outFilteredArrays.sort((a, b) => newArrays.indexOf(a) - newArrays.indexOf(b));
}

/**
 * Function that checks if the substring is a prefix of any of the strings
 *
 */
export function isStrPrefixOfAnyOfStrs(newSubStr: string, newStrs: string[]) {
  for (const str of newStrs) {
    if (str.startsWith(newSubStr)) {
      return true;
    }
  }
  return false;
}

/**
 * Function that produces an object out of an array of its key paths where keys are separated by the provided separator
 * - e.g. ["a", "a.b", "b", "b.a"]
 *   -  {a: {a: null, b: null}, b: {a: null}}
 * - in order to achieve this kind of structure, the function sorts key path strings before conversion, e.g.:
 *   -  "a", "a.a", "a.b", "b.a", "b.b"
 *
 */
export function convertKeyPathStrsWithSepToObj(newKeyPathStrs: string[], newSep = '.'): PropertiesObj {
  const outputObj: PropertiesObj = {};

  newKeyPathStrs.sort();
  const sortedKeyPathsStrs: string[] = newKeyPathStrs; // we sort the array alphabetically
  const sortedKeyPaths: string[][] = sortedKeyPathsStrs.map((keyPathStr) => keyPathStr.split(newSep));
  const sortedAndFilteredKeyPaths = removeAllArrayPrefixesOfExistingArraysInArrayList(sortedKeyPaths) as string[][];

  for (const keyPath of sortedAndFilteredKeyPaths) {
    setNestedObjPropFromKeyPathWithValue(outputObj, keyPath, null);
  }

  return outputObj;
}

/**
 * Function to set a nested property of an object
 * - e.g. setting value 'X' on keyPath of ['key1', 'key1_2'] in object {a: 1, key1: 2} would result in:
 * {a: 1, key1: {key1_2: 'X'}}
 * - keys from keyPath are checked to only be 'own' properties
 *
 * @param newObj object to be modified
 * @param newKeyPath an array of keys
 * @param newValue value of the last (potentially nested) key from key path
 */
export function setNestedObjPropFromKeyPathWithValue(newObj: PropertiesObj, newKeyPath: string[], newValue: any) {
  const keyPathLength = newKeyPath.length;
  if (keyPathLength === 0) {
    return newObj; // we return unmodified object if no key path specified
  }
  let key;
  let nestedObj = newObj;
  for (let i = 0; i < keyPathLength - 1; i++) {
    key = newKeyPath[i];
    if (!hasOwnPropertyKey(nestedObj, key) || !isObject(nestedObj[key])) {
      // if the object property does not exist (or it exists, we created it previously, but it was used again in the
      // next key path), we create and assign an empty object to it
      nestedObj[key] = {};
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    nestedObj = nestedObj[key];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  nestedObj[newKeyPath[keyPathLength - 1]] = newValue;
}

/**
 * Function to get a nested property of an object
 * - e.g. getting the value on keyPath of ['key1', 'key1_2'] in object {a: 1, key1: {key1_2: 'X'}} would result in 'X'
 * - keys from keyPath are checked to only be 'own' properties
 *
 * @param newObj object to be modified
 * @param newKeyPath an array of keys
 * @returns the found value of undefined
 *
 */
export function getNestedObjPropFromKeyPathWithValue(newObj: PropertiesObj, newKeyPath: string[]): any {
  const keyPathLength = newKeyPath.length;
  if (keyPathLength === 0) {
    return undefined; // we return undefined if no key path specified
  }
  let key;
  let nestedObj = newObj;
  for (let i = 0; i < keyPathLength - 1; i++) {
    key = newKeyPath[i];
    if (!hasOwnPropertyKey(nestedObj, key) || !isObject(nestedObj[key])) {
      // if the object property does not exist, we return undefined
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    nestedObj = nestedObj[key];
  }

  return nestedObj[newKeyPath[keyPathLength - 1]];
}

/**
 * Function to create a new object where value (turned to string) is used as key and key of this value is used as value
 * - e.g. {'a' : 1, 'b' : 2} -> {'1' : 'a', '2': 'b'}
 * - if there are duplicate values, the latter value will overwrite the previous one with its key
 * - only shallow values are switched, so only values of primitive types should be used (e.g. object-type values 'a' :
 * {} will be turned to string -> 'object Object' : 'a')
 *
 * @param newObj object to reverse
 * @returns new object
 *
 */
export function reverseMapObjBySwitchingValueWithKey(newObj: PropertiesObj): PropertiesObj {
  const outObj: PropertiesObj = {};
  for (const key of Object.keys(newObj)) {
    outObj[`${String(newObj[key])}`] = key;
  }
  return outObj;
}

export type UniqueCountedElem<TElem> = { elem: TElem; count: number };
export type UniqueCountedElemAccumulatorObj<TElem> = { [id: string]: UniqueCountedElem<TElem> };

/**
 * Function to get:
 * 1) all the unique elements from array - each element is compared to another by its special ID
 * (each element is identified by special ID)
 * - function does not compare whole elements or their references, but uniqueness is represented by a special ID that
 *   is generated/extracted for each element by a special function provided as parameter
 * 2) the number of occurences of the ID of each element
 *
 * Function preserves order of unique elements
 *
 * @param newArray array of (potentially non-unique) elements (of any type)
 * @param newElemIdFunc function that will be called on each array element and it must return a string or number that
 * will be used as a key in the accumulator object
 * @param newAccInitObj accumulator object - the initial state for the reducer
 * - if provided, this function will modify this object (side-effect)
 * - if not provided, the initial state is an empty object {}
 * @returns an object where keys are the IDs of elements and each key has a value of an object {elem: array_element,
 * count: element's_count_in_array}
 *
 */
export function getUniqueElemsAndTheirCountFromArray<TElem>(
  newArray: TElem[],
  newElemIdFunc: (elem: TElem) => string | number,
  newAccInitObj: UniqueCountedElemAccumulatorObj<TElem> = {},
): UniqueCountedElemAccumulatorObj<TElem> {
  const accObj: UniqueCountedElemAccumulatorObj<TElem> = newAccInitObj;
  newArray.forEach((elem: TElem) => {
    const id = newElemIdFunc(elem);
    accObj[id] = accObj[id] || { elem: elem, count: 0 };
    accObj[id].count += 1;
  });

  return accObj;
}

/**
 * Function to get all the unique elements from array - each element is compared to another by its special ID
 * (each element is identified by special ID)
 * - function does not compare whole elements or their references, but uniqueness is represented by a special ID that
 *   is generated/extracted for each element by a special function provided as parameter
 *
 * Function preserves order of unique elements
 *
 * @param newArray array of (potentially non-unique) elements (of any type)
 * @param newElemIdFunc function that will be called on each array element and it must return a string or number that
 * will be used as a key in the accumulator object
 *
 * @returns an array of unique elements with preserved order
 *
 */
export function getUniqueElemsFromArray<TElem>(
  newArray: TElem[],
  newElemIdFunc: (elem: TElem) => string | number,
): TElem[] {
  const countedElemsObj = getUniqueElemsAndTheirCountFromArray(newArray, newElemIdFunc);
  return Object.values(countedElemsObj).map((countedElem) => countedElem.elem);
}

/**
 * Function to get all the unique element groups (subarrays) from array - each element group contains elements with the
 * same special ID (GROUP ID)
 * (each element is identified by special ID)
 * - the complete number of elements in the resulting group subarrays is the same as the number of elements in the
 *   origin array
 * - function does not compare whole elements or their references, but uniqueness is represented by a special ID that
 *   is generated/extracted for each element by a special function provided as parameter
 *
 * @param newArray array of (potentially non-unique) elements (of any type)
 * @param newElemIdFunc function that will be called on each array element and it must return a string or number that
 * will be used GROUP ID
 *
 * @returns an array of arrays (groups) of elements
 *
 */
export function getUniqueElemGroupsFromArray<TElem>(
  newArray: TElem[],
  newElemIdFunc: (elem: TElem) => string | number,
): TElem[][] {
  const resObj: { [groupId: string]: TElem[] } = {};
  let elemId;
  for (const elem of newArray) {
    elemId = newElemIdFunc(elem);
    if (!hasOwnPropertyKey(resObj, elemId)) {
      resObj[elemId] = [];
    }
    resObj[elemId].push(elem);
  }
  return Object.values(resObj);
}

/**
 * Function to create an object out of an array of elements - each element is identified by a special ID which is
 * retrieved using a special ID function
 * - if the function produces the same ID for multiple elements, the latter ones will overwrite the previous ones and
 *   the previous ones will be lost
 *   - best to make the function so that no clashes occur
 *
 * @param newArray array of elements (of any type)
 * @param newElemIdFunc function that will be called on each array element and it must return a string or number that
 * will be used as a key in the output object
 *
 * @returns an object where keys are the IDs of elements and each key has a value of the element
 *
 */
export function createObjFromArray<TElem>(
  newArray: TElem[],
  newElemIdFunc: (elem: TElem) => string | number,
): { [key: string]: TElem } {
  const outObj: { [key: string]: TElem } = {};

  for (const elem of newArray) {
    outObj[newElemIdFunc(elem)] = elem;
  }

  return outObj;
}
