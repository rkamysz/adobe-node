
export interface AdobeApp {
  init(): void;
  on(event: string, callback: Function): AdobeApp;
  runScript(command: string, options?: Options): Promise<any>;
  saveDocument(document: string, saveAs?: string): Promise<any>;
  openDocument(...documents: string[]): Promise<any>;
  closeDocument(...documents: string[]): Promise<any>;
  newDocument(options?: NewDocumentOptions): Promise<any>
  open(): Promise<any>;
  close(): Promise<void>;
  dispose(): void;
}

export enum AdobeAppName {
  Animate = 'animate',
  Photoshop = 'photoshop',
  Illustrator = 'illustrator',
  InDesign = 'indesign'
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
  name?: string;
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
  setVariables(value: string): AdobeScriptBuilder;
  setBody(value: string): AdobeScriptBuilder;
  setBroadcast(value: string): AdobeScriptBuilder;
  build(): string;
}

export interface CommandFileCreator {
  create(command: string, options?: Options): Promise<string>;
}

export interface BroadcastBuilder {
  build(command: string): string;
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

export enum AdobeAppEvent {
  OpenApp = "open_app",
  CloseApp = "close_app",
  NewDocument = "new_document",
  OpenDocument = "open_document",
  CloseDocument = "close_document",
  SaveDocument = "save_document",
  RunScript = "run_script"
}
