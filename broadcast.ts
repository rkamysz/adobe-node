import { AdobeAppName, BroadcastBuilder, BroadcastMessage, Config } from "./api";
import { exec } from 'child_process';

const broadcastMethods: Map<AdobeAppName, (cmd: string) => string> = new Map<AdobeAppName, (cmd: string) => string>([
  [AdobeAppName.Animate, (cmd: string) => `FLfile.runCommandLine("${cmd}");`],
  [AdobeAppName.Photoshop, (cmd: string) => `app.system("${cmd}");`]
]);

const buildBroadcastCommand = (host: string, port: number, message: string) =>
  `adobe-broadcast --host='${host}' --port=${port} --msg='${message}'`;

export const newBroadcastBuilder = (config: Config): BroadcastBuilder => {

  return {
    build(command: string) {
      const payload: string = `{\\"command\\":\\"${command}\\",\\"stdout\\":\\"" + __stdout + "\\", \\"stderr\\":\\"" + __stderr + "\\" }`;
      const broadcast: (msg: string) => string = broadcastMethods.get(config.app.name);
      const cmd: string = buildBroadcastCommand(config.host, config.port, payload);
      return broadcast(cmd);
    }
  }
}

export const broadcast = (host: string, port: number, message: BroadcastMessage) => {
  const cmd: string = buildBroadcastCommand(host, port, JSON.stringify(message));
  exec(cmd);
}
