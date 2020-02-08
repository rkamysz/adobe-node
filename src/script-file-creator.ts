import * as path from "path";
import * as fs from "fs";
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
                    : arg.constructor.name === "Array" ? `${JSON.stringify(arg)}`
                        : arg};`);

            } else {
                list.push(`var ${name};`);
            }
        }

        return `${list.length ? list.join('\n') : ''}`
    };

    const buildBody = (command: string, useBuiltInScript: boolean): string => {
        const scriptPath: string = path.join(jsPath, appName, `${command}.js`);
        const builtInScript: string = path.join(__dirname, '..', 'scripts', appName, `${command}.js`);
        
        if (useBuiltInScript && fs.existsSync(builtInScript)) {
            console.info(`Built-in Script file found: ${builtInScript}`);
            return fs.readFileSync(builtInScript).toString();
        }

        if (fs.existsSync(scriptPath)) {
            console.info(`Custom script file found: ${scriptPath}`);
            return fs.readFileSync(scriptPath).toString();
        }

        return `"";`;
    }

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

    return {
        create: (command: string, useBuiltInScript: boolean, args?: Options): Promise<string> =>
            new Promise((resolve, reject) => {
                const variables: string = buildVars(args);
                const body: string = buildBody(command, useBuiltInScript);
                const broadcast: string = broadcastBuilder.build(command);

                let content: string = scriptBuilder
                    .setName(command)
                    .setVariables(variables)
                    .setBody(body)
                    .setBroadcast(broadcast)
                    .build();
                return createFile(command, content).then(resolve).catch(reject);
            })
    }
}

export default newAdobeScriptFileCreator;