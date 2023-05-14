import ejs from 'ejs';
import { getAbsoluteFilePath, readFile } from '@shared/helpers/files';

// single-file Templates that use absolute paths

export type TemplateLocalsObject = Record<string, unknown>;
export type TemplateOf<T = TemplateLocalsObject> = (locals: T) => string;

export class TemplateManager {
  // Store for single-file Templates
  private readonly templatesStoreObj: Record<string, TemplateOf> = {};

  /**
   * Wrapper of ejs.compile function
   *
   */
  private _compileFile(newFilePath: string) {
    return ejs.compile(newFilePath);
  }

  getTemplate<TLocals extends TemplateLocalsObject>(newTemplateKey: string): TemplateOf<TLocals> | undefined {
    return this.templatesStoreObj[newTemplateKey];
  }

  /**
   * Read and compile one file Template - saving it under the provided key - and return it
   * - if the Template's Key already exists in the manager, the saved Template will be returned
   *
   * @param newTemplateFilePath path to the Template (will be converted to absolute path)
   * @param newTemplateKey key (name) of the Template to save the compiled output under in the manager
   * - if null or undefined, newTemplatePath parameter's value will be used as key
   * @param newForceRead if true and the Template's key already exists, the Template will be recompiled and saved anew
   * overwriting the original one
   *
   */
  readAndSaveTemplateFile<TLocals extends TemplateLocalsObject>(
    newTemplateFilePath: string,
    newTemplateKey?: string,
    newForceRead = false,
  ) {
    newTemplateFilePath = getAbsoluteFilePath(newTemplateFilePath);
    newTemplateKey = newTemplateKey ?? newTemplateFilePath;
    if (!this.templatesStoreObj[newTemplateKey] || newForceRead) {
      const content = readFile(newTemplateFilePath);
      if (content == null) throw new Error(`Template file '${newTemplateFilePath}' not found!`);
      this.templatesStoreObj[newTemplateKey] = this._compileFile(content);
    }
    return this.getTemplate<TLocals>(newTemplateKey) as TemplateOf<TLocals>;
  }
}
