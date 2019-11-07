import { AdobeScriptCommand, CommandStack } from "./api";

const newCommandStack = (): CommandStack => {

    const stack: Map<string, AdobeScriptCommand[]> = new Map<string, AdobeScriptCommand[]>();

    return {
        push: (data: AdobeScriptCommand): Promise<void> => new Promise(resolve => {
            if (!stack.has(data.command)) stack.set(data.command, []);
            stack.get(data.command).push(data);
            return resolve();
        }),
        resolve: (commandName: string): Promise<void> => new Promise(resolve => {
            if (stack.has(commandName)) {
                const command = stack.get(commandName).shift();
                if(command) {
                    command.resolve();
                }
            }
            return resolve();
        })
    }
};

export default newCommandStack;