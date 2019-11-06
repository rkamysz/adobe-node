import { AdobeScriptCommand, CommandStack } from "./api";

const newCommandStack = (): CommandStack => {

    const stack: Map<string, AdobeScriptCommand[]> = new Map<string, AdobeScriptCommand[]>();

    return {
        push: (data: AdobeScriptCommand): Promise<void> => {
            if (!stack.has(data.command)) stack.set(data.command, []);
            stack.get(data.command).push(data);
            return Promise.resolve();
        },
        resolve: (command: string): Promise<void> => {
            if (stack.has(command)) {
                return stack.get(command).shift().resolve();
            }
            return Promise.resolve();
        }
    }
};

export default newCommandStack;