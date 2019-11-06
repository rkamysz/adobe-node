import { AdobeEventListener } from './api';

import { ServerResponse, IncomingMessage, Server, createServer, RequestListener } from 'http';

const newAdobeAppListener = (host: string, port: number, callback: (command: string) => void): AdobeEventListener => {

  const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');

    req.on('data', (chunk: any) => {
      const data: any = JSON.parse(chunk);
      
      if (callbacks.has(data.command)) {
        callbacks.get(data.command)(data.stdout, data.error);
      }
      callback(data.command);
    });
    res.end();
  }

  const callbacks: Map<string, Function> = new Map<string, Function>();
  const server: Server = createServer(requestListener);

  return {
    addEventListener: (event: string, callback: Function): void => {
      if (callbacks.has(event)) {
        console.warn(`${event} listener will be overwritten`);
      }
      callbacks.set(event, callback);
    },
    start: (): void => {
      server.listen(port, host, () => {
        console.log(`Adobe Event Listener running at port ${port}`);
      });
    },
    close: (): void => {
      server.close();
      console.log(`Adobe Event Listener has been stopped at port ${port}`);
    }
  }
}

export default newAdobeAppListener;
