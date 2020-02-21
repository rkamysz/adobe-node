import { AdobeAppName, BroadcastBuilder, BroadcastMessage, Config } from "./api";
import { exec } from 'child_process';

const broadcastMethods: Map<AdobeAppName, (cmd: string, payload: string) => string> = new Map<AdobeAppName, (cmd: string, payload: string) => string>([
  [AdobeAppName.Animate, (cmd: string, payload: string) => `FLfile.runCommandLine("${cmd}");`],
  [AdobeAppName.Photoshop, (cmd: string, payload: string) => `app.system("${cmd}");`],
  [AdobeAppName.Illustrator, (cmd: string, payload: string) => `
  const bt = new BridgeTalk();
  bt.target = 'bridge';
  const btCmd = '${cmd.replace(/'/g, "\\'")}';
  bt.body = 'const cmd = "' + btCmd + '";';
  bt.body += 'const msg = \\\'${payload}\\\';';
  bt.body += 'const sys = cmd + " --msg=\\\'" + msg + "\\\'";';
  bt.body += 'app.system(sys);';
  bt.onError = function(bt)  
  {  
    alert(bt.body); 
  };
  bt.send();
  alert(bt.body);
  `]
]);

const buildBroadcastCommand = (host: string, port: number, message: string) =>
  `adobe-broadcast --host='${host}' --port=${port}`;

export const newBroadcastBuilder = (config: Config): BroadcastBuilder => {

  return {
    build(command: string) {
      const payload: string = `{"command": "${command}"}`;
      const broadcast: (msg: string, payload: string) => string = broadcastMethods.get(config.app.name);
      const cmd: string = buildBroadcastCommand(config.host, config.port, payload);
      return broadcast(cmd, payload);
    }
  }
}

export const broadcast = (host: string, port: number, message: BroadcastMessage) => {
  const cmd: string = buildBroadcastCommand(host, port, JSON.stringify(message));
  exec(cmd);
}
