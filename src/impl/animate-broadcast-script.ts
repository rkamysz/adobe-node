import { buildBroadcastCommand } from './broadcast';

export const buildAnimateBroadcastScript = (host: string, port: number, command: string) => {
  return `FLfile.runCommandLine("${buildBroadcastCommand(host, port, command)}");`;
}
