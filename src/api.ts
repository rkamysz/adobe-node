
export interface AdobeApp {
  init(): void;
  on(event: string, callback: Function): AdobeApp;
  runScript(path: string, options?: Options): Promise<any>;
  selectDocument(document: string): Promise<any>;
  saveDocument(...documents: string[]): Promise<any>;
  saveAsDocument(document: string, saveAs: string, options?: object): Promise<any>;
  openDocument(...documents: string[]): Promise<any>;
  closeDocument(...documents: string[]): Promise<any>;
  saveAndCloseDocument(...documents: string[]): Promise<any>;
  newDocument(options?: NewDocumentOptions): Promise<any>
  open(): Promise<any>;
  close(): Promise<void>;
  dispose(): void;
}

export enum AdobeAppName {
  Animate = 'animate',
  Photoshop = 'photoshop',
  Illustrator = 'illustrator',
  InDesign = 'indesign',
  Acrobat = 'acrobat',
  AfterEffects = 'after_effects'
}

export enum AdobeAppScriptFileType {
  Jsfl = 'jsfl',
  Jsx = 'jsx'
}

export type AdobeProcessOptions = {
  timeout?: number;
  timeoutCallback?: Function;
}

export type Options = {
  [prop:string]:any
}

export type NewDocumentOptions = Options & {
  title?: string;
  width?: number,
  height?: number
}

export type AdobeAppConfig = {
  name: AdobeAppName;
  path: string;
  adobeScriptsPath: string;
}

export type Config = {
  app:AdobeAppConfig;
  host: string;
  port: number;
  appTimeout?: number;
  jsPath?: string;
}

export interface AdobeEventListener {
  addEventListener(event: string, callback: Function): void;
  start(): void;
  close(): void;
}

export interface AdobeAppProcess {
  create(script: string): void;
  kill(): void;
  run(commandPath: string): void;
}

export interface CommandStack {
  push(data: AdobeScriptCommand): void;
  resolve(commandName: string): Promise<void>;
}

export interface AdobeScriptBuilder {
  setName(value: string): AdobeScriptBuilder;
  setVariables(args: any): AdobeScriptBuilder;
  setBody(value: string): AdobeScriptBuilder;
  setBroadcast(value: string): AdobeScriptBuilder;
  build(): string;
}

export interface AdobeScriptCreator {
  create(command: string, body?: string, options?: Options): Promise<string>;
}

export interface BroadcastMessage {
  command: string;
  stdout?: string;
  stderr?: string;
}

export interface AdobeScriptCommand {
  command: string;
  resolve: Function;
  reject: Function;
}

export interface ScriptReader {
  readBuiltInScript(command: string): string;
  readCustomScript(scriptPath: string): string;
}

export enum AdobeAppEvent {
  OpenApp = "open_app",
  CloseApp = "close_app",
  NewDocument = "new_document",
  OpenDocument = "open_document",
  CloseDocument = "close_document",
  SaveAndCloseDocument = "save_and_close_document",
  SaveDocument = "save_document",
  SelectDocument = "select_document",
  SaveAsDocument = "save_as_document",
  RunScript = "run_script"
}
