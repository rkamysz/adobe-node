import * as path from "path";
import { AdobeScriptCommand, CommandStack } from "./api";

const newCommandStack = (): CommandStack => {

    const stack: Map<string, AdobeScriptCommand[]> = new Map<string, AdobeScriptCommand[]>();

    return {
        push: (data: AdobeScriptCommand): Promise<void> => new Promise(resolve => {
            const commandName: string = path.basename(data.command).replace(/\.\w+$/,'');
            if (!stack.has(commandName)) stack.set(commandName, []);
            stack.get(commandName).push(data);
            return resolve();
        }),
        resolve: (commandName: string): Promise<void> => {
            if (stack.has(commandName)) {
                const command = stack.get(commandName).shift();

                if(command) {
                    return command.resolve();
                }
            }

            return Promise.resolve();
        }
    }
};

export default newCommandStack;