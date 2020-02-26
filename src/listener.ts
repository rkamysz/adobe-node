import { AdobeEventListener, BroadcastMessage } from './api';
import { Socket, Server, createServer } from 'net';

const newAdobeAppListener = (host: string, port: number, callback: (commandName: string) => void): AdobeEventListener => {

  const callbacks: Map<string, Function> = new Map<string, Function>();
  let server: Server;
  let client: Socket;

  function connectionListener(socket: Socket) {
    client = socket;
    socket.on('data', (buffer: Buffer) => {
      try {
        const dataString = buffer.toString();
        const data: any = JSON.parse(dataString);
        if (callbacks.has(data.command)) {
          const callback = callbacks.get(data.command);
          callback(data.stdout, data.stderr);
        }
        callback(data.command);
      } catch (error) {
        console.error("Failed to convert data: " + error);
      }
    });
  }

  function disposeServer() {
    if (client) {
      client.end();
    }
    server = null;
    console.log(`Adobe Event Listener has been stopped at port ${port}`);
  }

  return {
    addEventListener: (event: string, callback: Function): void => {
      if (callbacks.has(event)) {
        console.warn(`${event} listener will be overwritten`);
      }
      callbacks.set(event, callback);
    },
    start: (): void => {
      if (server) return;
      server = createServer(connectionListener);
      server.listen(port, host, () => {
        console.log(`Adobe Event Listener running at ${host}:${port}`);
      });
    },
    close: (): void => {
      server.close(disposeServer);
    }
  }
}

export default newAdobeAppListener;
