import * as path from "path";
import { AdobeAppEvent, AdobeAppProcess, AdobeScriptCreator, CommandStack, Config, NewDocumentOptions, Options, AdobeApp, AdobeEventListener, ScriptReader } from "../api";
import newAdobeAppListener from './listener';
import newAdobeAppProcess from './process';
import newCommandStack from './commands';
import newAdobeScriptCreator from './script-file-creator';
import { newScriptReader } from './script-reader';

export const newAdobeApp = (config: Config, timeoutCallback?: Function): AdobeApp => {
  const scriptReader: ScriptReader = newScriptReader(config);
  const scriptCreator: AdobeScriptCreator = newAdobeScriptCreator(config);
  const commandStack: CommandStack = newCommandStack();
  const appProcess: AdobeAppProcess = newAdobeAppProcess(config, {
    timeout: config.appTimeout,
    timeoutCallback
  });
  const eventListener: AdobeEventListener = newAdobeAppListener(
    config.host, 
    config.port, 
    async (commandName: string) => {
      await commandStack.resolve(commandName);
  });

  const createScript = (command: string, body: string, options?: Options): Promise<any> =>
      new Promise(async (resolve, reject) => {
        const commandPath: string = await scriptCreator.create(command, body, options);
        commandStack.push({ command, resolve, reject });
        appProcess.run(commandPath);
      })

  const app: AdobeApp = {
    init() {
      eventListener.start();
    },
    on(event: string, callback: Function): AdobeApp {
      eventListener.addEventListener(event, callback);
      return app;
    },

    runScript: (scriptPath: string, options?: Options): Promise<any> => {
      const body: string = scriptReader.readCustomScript(scriptPath);
      const command: string = path.basename(scriptPath).split('.').shift();
      return createScript(command, body, options)
    },

    saveDocument: (...documents: string[]): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.SaveDocument);
      return createScript(AdobeAppEvent.SaveDocument, body, { documents })
    },
    
    selectDocument: (document: string): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.SelectDocument);
      return createScript(AdobeAppEvent.SelectDocument, body, { document })
    },

    saveAsDocument: (document: string, saveAs: string, options?: object): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.SaveAsDocument);
      return createScript(AdobeAppEvent.SaveAsDocument, body, { document, saveAs, options })
    },

    openDocument: (...documents: string[]): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.OpenDocument);
      return createScript(AdobeAppEvent.OpenDocument, body, { documents })
    },

    closeDocument: (...documents: string[]): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.CloseDocument);
      return createScript(AdobeAppEvent.CloseDocument, body, { documents })
    },

    saveAndCloseDocument: (...documents: string[]): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.SaveAndCloseDocument);
      return createScript(AdobeAppEvent.SaveAndCloseDocument, body, { documents })
    },

    newDocument: (options?: NewDocumentOptions): Promise<any> => {
      const body: string = scriptReader.readBuiltInScript(AdobeAppEvent.NewDocument);
      return createScript(AdobeAppEvent.NewDocument, body, options)
    },

    open: (): Promise<any> => new Promise(async (resolve, reject) => {
      const scriptPath = await scriptCreator.create(AdobeAppEvent.OpenApp)
      appProcess.create(scriptPath);
      commandStack.push({
        command: AdobeAppEvent.OpenApp, resolve, reject
      });
    }),

    close: (): Promise<void> => new Promise(async (resolve, reject) => {
      appProcess.kill();
      commandStack.push({
        command: AdobeAppEvent.CloseApp, resolve, reject
      });
    }),
    dispose: (): void => {
      eventListener.close();
    }
  }

  return app;
}
