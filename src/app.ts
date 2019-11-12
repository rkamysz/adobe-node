

import { AdobeAppEvent, AdobeAppProcess, CommandFileCreator as AdobeScriptCreator, CommandStack, Config, NewDocumentOptions, Options, AdobeApp, AdobeEventListener } from "./api";
import newAdobeAppListener from './listener';
import newAdobeAppProcess from './process';
import newCommandStack from './commands';
import newAdobeScriptCreator from './script-file-creator';
import { broadcast } from './broadcast';

export const newAdobeApp = (config: Config, timeoutCallback?: Function): AdobeApp => {

  const scriptCreator: AdobeScriptCreator = newAdobeScriptCreator(config);
  const commandStack: CommandStack = newCommandStack();
  const eventListener: AdobeEventListener = newAdobeAppListener(config.host, config.port, eventListenerCallback);
  const appProcess: AdobeAppProcess = newAdobeAppProcess(config.app.path, appCloseCallback, {
    timeout: config.appTimeout,
    timeoutCallback
  });

  function eventListenerCallback(commandName: string) {
    commandStack.resolve(commandName);
  }

  function appCloseCallback() {
    broadcast(config.host, config.port, { command: AdobeAppEvent.CloseApp });
  }

  function useBuiltInScript(command: string): boolean {
    return command === AdobeAppEvent.CloseDocument 
      || command === AdobeAppEvent.SaveDocument
      || command === AdobeAppEvent.SaveAndCloseDocument
      || command === AdobeAppEvent.SaveAsDocument
      || command === AdobeAppEvent.OpenDocument
      || command === AdobeAppEvent.NewDocument
      || command === AdobeAppEvent.SelectDocument;
  }

  const app: AdobeApp = {
    init() {
      eventListener.start();
    },
    on(event: string, callback: Function): AdobeApp {
      eventListener.addEventListener(event, callback);
      return app;
    },

    runScript: (command: string, options?: Options): Promise<any> =>
      new Promise(async (resolve, reject) => {
        const commandPath: string = await scriptCreator.create(command, useBuiltInScript(command), options);
        commandStack.push({ command, resolve, reject });
        appProcess.run(commandPath);
      }),

    saveDocument: (...documents: string[]): Promise<any> =>
      app.runScript(AdobeAppEvent.SaveDocument, { documents }),
    
    selectDocument: (document: string): Promise<any> =>
      app.runScript(AdobeAppEvent.SelectDocument, { document }),

    saveAsDocument: (document: string, saveAs: string, options?: object): Promise<any> =>
      app.runScript(AdobeAppEvent.SaveAsDocument, { document, saveAs, options }),

    openDocument: (...documents: string[]): Promise<any> =>
      app.runScript(AdobeAppEvent.OpenDocument, { documents }),

    closeDocument: (...documents: string[]): Promise<any> =>
      app.runScript(AdobeAppEvent.CloseDocument, { documents }),

    saveAndCloseDocument: (...documents: string[]): Promise<any> =>
      app.runScript(AdobeAppEvent.SaveAndCloseDocument, { documents }),

    newDocument: (options?: NewDocumentOptions): Promise<any> =>
      app.runScript(AdobeAppEvent.NewDocument, options),

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
