import { AdobeScriptBuilder } from '../api';

const commandTemplate: string = `
var ___{{__command__}} = (function() {
    var __stderr;
    var __stdout;
    
    try {
      {{__vars__}}  
      __stdout = {{__fn__}}
    } catch (e) {
      __stderr = e;
    } finally {
      {{__broadcast__}}
    }
  })();`;

const newAdobeScriptBuilder = (): AdobeScriptBuilder => {

  let name: string;
  let vars: string;
  let body: string;
  let broadcast: string;

  const builder = {
    setName(value: string) {
      name = value;
      return builder;
    },
    setVariables(args: any) {
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
      vars = `${list.length ? list.join('\n') : ''}`;
      return builder;
    },
    setBody(value: string) {
      body = value;
      return builder;
    },
    setBroadcast(value: string) {
      broadcast = value;
      return builder;
    },
    build() {
      return commandTemplate
        .replace('{{__command__}}', name)
        .replace('{{__vars__}}', vars)
        .replace('{{__fn__}}', body)
        .replace('{{__broadcast__}}', broadcast);
    }
  }

  return builder;
}

export default newAdobeScriptBuilder;