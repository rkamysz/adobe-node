import { AdobeAppName, BroadcastBuilder, BroadcastMessage, Config } from "./api";
import { exec } from 'child_process';

const broadcastMethods: Map<AdobeAppName, (cmd: string) => string> = new Map<AdobeAppName, (cmd: string) => string>([
  [AdobeAppName.Animate, (cmd: string) => `FLfile.runCommandLine("${cmd}");`],
  [AdobeAppName.Photoshop, (cmd: string) => `app.system("${cmd}");`]
]);

const buildCurlCommand = (host: string, port: number, message: string) =>
  `curl -d '${message}' -H \\"Content-Type: application/json\\" -X POST http://${host}:${port}`;

export const newBroadcastBuilder = (config: Config): BroadcastBuilder => {

  return {
    build(command: string) {
      const payload: string = `{\\"command\\":\\"${command}\\",\\"stdout\\":\\"" + __stdout + "\\", \\"stderr\\":\\"" + __stderr + "\\" }`;
      const broadcast: (msg: string) => string = broadcastMethods.get(config.app.name);
      const curl: string = buildCurlCommand(config.host, config.port, payload);
      return broadcast(curl);
    }
  }
}

export const broadcast = (host: string, port: number, message: BroadcastMessage) => {
  const curl: string = buildCurlCommand(host, port, JSON.stringify(message));
  exec(curl);
}
