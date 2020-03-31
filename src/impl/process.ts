import * as os from "os";
import { exec, ChildProcess, execFile, ExecException } from "child_process";
import { AdobeProcessOptions, AdobeAppProcess, Config, AdobeAppEvent } from "../api";
import { existsSync } from 'fs';
import { buildBroadcastCommand } from './broadcast';

const newAdobeAppProcess = ({app: { path: appPath }, host, port}: Config, options?: AdobeProcessOptions): AdobeAppProcess => {
  let process: ChildProcess;
  const timeoutCallback: Function = options.timeoutCallback;
  const processTimeout: number = options.timeout || 0;
  const openCmd: string = os.platform() === "win32" ? "start" : "open -a";

  const createCallback = (execTime: number) => (error: ExecException, stdout: string, stderr: string) => {
    let becauseOfTimeout: boolean = Date.now() - execTime >= processTimeout && processTimeout > 0;
    if (becauseOfTimeout && timeoutCallback) {
      timeoutCallback(error);
    } else {
      exec(buildBroadcastCommand(host, port, AdobeAppEvent.CloseApp, true, true).replace(/\\/g,''));
    }
  };

  return {
    create:(openAppScript: string): void => {
      const execFileCallback = createCallback(Date.now());
      if(!existsSync(appPath)) {
        throw new Error('Wrong app path');
      }
      process = execFile(appPath, [openAppScript], { timeout: processTimeout }, execFileCallback);
    },
    kill:(): void => {
      process.kill();
    },
    run:(commandPath: string): void => {
      exec(`${openCmd} ${appPath.replace(/ /g, "\\ ")} ${commandPath.replace(/ /g, "\\ ")}`);
    }
  }
}

export default newAdobeAppProcess;