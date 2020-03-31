import * as path from "path";
import * as fs from "fs";
import { AdobeAppName, AdobeAppScriptFileType, AdobeScriptCreator, AdobeScriptBuilder, Config, Options } from "../api";
import newAdobeScriptBuilder from './script-builder';
import defaults from './defaults';
import { buildAnimateBroadcastScript } from './animate-broadcast-script';
import { buildBridgeTalkBroadcastScript } from './bridge-talk-broadcast-script';

const scriptingExtension: Map<AdobeAppName, AdobeAppScriptFileType> = new Map<AdobeAppName, AdobeAppScriptFileType>([
    [AdobeAppName.Animate, AdobeAppScriptFileType.Jsfl],
    [AdobeAppName.Photoshop, AdobeAppScriptFileType.Jsx],
    [AdobeAppName.Illustrator, AdobeAppScriptFileType.Jsx],
    [AdobeAppName.InDesign, AdobeAppScriptFileType.Jsx]
]);

const newAdobeScriptFileCreator = (config: Config): AdobeScriptCreator => {
    const appName: AdobeAppName = config.app.name
    const adobeScriptsPath: string = config.app.adobeScriptsPath || defaults.adobeScriptsPath;
    const scriptBuilder: AdobeScriptBuilder = newAdobeScriptBuilder();

    const createFile = (command: string, content: string): Promise<string> => new Promise((resolve, reject) => {
        const filePath: string = path.join(adobeScriptsPath, `${command}.${scriptingExtension.get(appName)}`);
        const fileDirname: string = path.dirname(filePath);
        if(fs.existsSync(fileDirname)) {
            fs.writeFile(filePath, content, "utf-8", (err) => {
                return err ? reject(err) : resolve(filePath)
            });
        } else {
            return reject(`The path (${fileDirname}) is not valid.`)
        }
    });

    const buildBroadcastScript = (command: string) => {
        const {host, port} = config;
        if (appName === AdobeAppName.Animate) {
            return buildAnimateBroadcastScript(host, port, command);
        }
        return buildBridgeTalkBroadcastScript(host, port, command)
    }

    return {
        create: (command: string, body: string, args?: Options): Promise<string> =>
            new Promise((resolve, reject) => {
                const broadcast: string = buildBroadcastScript(command);
                const content: string = scriptBuilder
                    .setName(command)
                    .setVariables(args)
                    .setBody(body)
                    .setBroadcast(broadcast)
                    .build();
                return createFile(command, content).then(resolve).catch(reject);
            })
    }
}

export default newAdobeScriptFileCreator;