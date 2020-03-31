#!/usr/bin/env node

import { connect, Socket } from "net";
import * as minimist from 'minimist';
import defaults from '../impl/defaults';

const args = minimist(process.argv.slice(2));

const host:string = args.host || defaults.host;
const port:number = Number(args.port) || defaults.port;
const message:string = args.msg;
const client: Socket = connect({ host, port }, () => {
    console.log('Adobe Broadcast connected');
});

client.setEncoding('utf8');

client.on('error', (error: Error) => {
    console.error(`Adobe Broadcast error: ${JSON.stringify(error)}`);
});

client.write(message, () => { 
    process.exit();
});