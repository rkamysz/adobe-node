import { buildBroadcastCommand } from './broadcast';

export const buildBridgeTalkBroadcastScript = (host: string, port: number, command: string) => {
  return `
  if (!__stdout) {
      __stdout = "{}";
  }
  if (!__stderr) {
      __stderr = "";
  }
  const bt = new BridgeTalk();
  bt.target = 'bridge';
  bt.body = 'app.system("${buildBroadcastCommand(host, port, command)}");';
  bt.onError = function(bt) {  
      alert("Error from BridgeTalk: " + bt.body); 
  };
  bt.send();
`;
}
