import * as path from "path";
import * as fs from "fs";
import mkdirp = require('mkdirp-promise');
import { AdobeAppName, AdobeAppScriptFileType, CommandFileCreator, AdobeScriptBuilder, BroadcastBuilder, Config, Options } from "./api";
import newAdobeScriptBuilder from './script-builder';
import { newBroadcastBuilder } from './broadcast';
import defaults from './defaults';

const scriptingExtension: Map<AdobeAppName, AdobeAppScriptFileType> = new Map<AdobeAppName, AdobeAppScriptFileType>([
    [AdobeAppName.Animate, AdobeAppScriptFileType.Jsfl],
    [AdobeAppName.Photoshop, AdobeAppScriptFileType.Jsx],
    [AdobeAppName.Illustrator, AdobeAppScriptFileType.Jsx],
    [AdobeAppName.InDesign, AdobeAppScriptFileType.Jsx]
]);

const newAdobeScriptFileCreator = (config: Config): CommandFileCreator => {
    const appName: AdobeAppName = config.app.name
    const jsPath: string = config.jsPath || defaults.scriptsPath;
    const adobeScriptsPath: string = config.app.adobeScriptsPath || defaults.adobeScriptsPath;
    const scriptBuilder: AdobeScriptBuilder = newAdobeScriptBuilder();
    const broadcastBuilder: BroadcastBuilder = newBroadcastBuilder(config);

    const buildVars = (args: any): string => {
        let list: string[] = [];
        let arg: any;
        for (let name in args) {
            arg = args[name];

            if (arg) {
                list.push(`var ${name}=${arg.constructor.name === "String" 
                    ? `"${arg}"` 
                    : arg.constructor.name === "Array"  ? `${JSON.stringify(arg)}` 
                    : arg};`);

            } else {
                list.push(`var ${name};`);
            }
        }

        return `${list.length ? list.join('\n') : ''}`
    };

    const buildBody = (command: string): string => {
        const scriptPath: string = path.join(jsPath, appName, `${command}.js`);

        if (fs.existsSync(scriptPath)) {
            console.info(`Script file found: ${scriptPath}`);
            return fs.readFileSync(scriptPath).toString();
        }

        return `"";`;
    }

    const buildCommandFileContent = (command: string, args?: Options): string => {
        const variables: string = buildVars(args);
        const body: string = buildBody(command);
        const broadcast: string = broadcastBuilder.build(command);

        return scriptBuilder
            .setName(command)
            .setVariables(variables)
            .setBody(body)
            .setBroadcast(broadcast)
            .build();
    }

    return {
        create: (command: string, args?: Options): Promise<string> =>
            new Promise((resolve, reject) => {
                const filePath: string = path.join(adobeScriptsPath, `${command}.${scriptingExtension.get(appName)}`);
                mkdirp(path.dirname(filePath))
                    .then(() => {
                        let content: string = buildCommandFileContent(command, args);
                        fs.writeFile(filePath, content, "utf-8", (err) => {
                            return err ? reject(err) : resolve(filePath)
                        });
                    })
                    .catch((error) => reject(error));
            })
    }
}

export default newAdobeScriptFileCreator;