import * as path from "path";
import * as fs from "fs";
import { Config, AdobeAppName, ScriptReader } from '../api';

export const newScriptReader = (config: Config): ScriptReader => {
    const appName: AdobeAppName = config.app.name

    return {
        readBuiltInScript:(command: string) => {
            const builtInScript: string = path.join(__dirname, '..', '..', 'scripts', appName, `${command}.js`);
            if (fs.existsSync(builtInScript)) {
                console.info(`Built-in Script file found: ${builtInScript}`);
                return fs.readFileSync(builtInScript).toString();
            }
            console.error(`Built-in script file not found: ${builtInScript}`);
            return `"";`;
        },
        readCustomScript:(scriptPath: string) => {
            if (fs.existsSync(scriptPath)) {
                console.info(`Custom script file found: ${scriptPath}`);
                return fs.readFileSync(scriptPath).toString();
            }
            console.error(`Custom script file not found: ${scriptPath}`);
            return `"";`;
        }
    }
}
