import { AdobeAppName, BroadcastBuilder, BroadcastMessage, Config } from "./api";
import { exec } from 'child_process';

const createPayload = (command: string): string => {
  return `{\\"command\\":\\"${command}\\",\\"stdout\\":\\"" + __stdout + "\\", \\"stderr\\":\\"" + __stderr + "\\" }`;
};

const buildBroadcastCommand = (host: string, port: number, message: string): string => {
  return `adobe-broadcast --host='${host}' --port=${port} --msg='${message}'`;
}

const broadcastMethods: Map<AdobeAppName, (host: string, port: number, command: string) => string> = new Map<AdobeAppName, (host: string, port: number, command: string) => string>([
  [AdobeAppName.Animate, (host: string, port: number, command: string) => `FLfile.runCommandLine("${buildBroadcastCommand(host, port, createPayload(command))}");`],
  [AdobeAppName.Photoshop, (host: string, port: number, command: string) => `app.system("${buildBroadcastCommand(host, port, createPayload(command))}");`],
  [AdobeAppName.Illustrator, (host: string, port: number, command: string) => {
    const cmd = `adobe-broadcast --host='${host}' --port=${port}`;
    return `
  if (!__stdout) {
    __stdout = "{}";
  }
  if (!__stderr) {
    __stderr = "";
  }
  const bt = new BridgeTalk();
  bt.target = 'bridge';
  const btCmd = '${cmd.replace(/'/g, "\\'")}';
  bt.body = 'const cmd = "' + btCmd + '";';
  bt.body += 'const msg = \\\'{"command": "${command}", "stdout": ' + __stdout + ', "stderr": "' + __stderr + '"}\\\';';
  bt.body += 'const sys = cmd + " --msg=\\\'" + msg + "\\\'";';
  bt.body += 'app.system(sys);';
  bt.onError = function(bt)  
  {  
    alert("Error from BridgeTalk: " + bt.body); 
  };
  bt.send();
  `
  }
  ]
]);

export const newBroadcastBuilder = (config: Config): BroadcastBuilder => {

  return {
    build(command: string) {
      const broadcast = broadcastMethods.get(config.app.name);
      return broadcast(config.host, config.port, command);
    }
  }
}

export const broadcast = (host: string, port: number, message: BroadcastMessage) => {
  const cmd: string = buildBroadcastCommand(host, port, JSON.stringify(message));
  exec(cmd);
}
