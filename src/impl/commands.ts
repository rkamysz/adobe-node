import { AdobeScriptCommand, CommandStack } from "../api";

const newCommandStack = (): CommandStack => {

    const stack: Map<string, AdobeScriptCommand[]> = new Map<string, AdobeScriptCommand[]>();

    return {
        push: (data: AdobeScriptCommand): void => {
            if (!stack.has(data.command)) stack.set(data.command, []);
            stack.get(data.command).push(data);
        },
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
