# adobe-node
Control Adobe applications - such as Photoshop, Animate, Illustrator, InDesign - from node. Run JavaScript to remotely - from the command line - create, modify or export document content. This module can be used to automate the workflow by creating an action chain that can be executed without user intervention.

## Installation

```
npm i adobe-node
```

## API

### Methods
| Method | Arguments | Description |
|:-------|:------------|:------------|
| `init` | - | Initializes the `AdobeApp` instance/ starts Adobe Event Listener.
| `on` | event: string,<br/>callback: (message: BroadcastMessage) => void | Adds an event handler function to listen to an event so that when that event occurs, the callback will be triggered.
| `runScript` | script: string,<br/>options?: Options | Runs custom JavaScript 
| `saveDocument` | document: string,<br/>saveAs?: string | Saves changes made to the document. Optionally, it can save the changes as a new file
| `openDocument` | ...documents: string[] | Opens documents.
| `closeDocument` | ...documents: string[] | Closes documents.
| `newDocument` | options?: NewDocumentOptions | Creates document.
| `open` | - | Opens the Adobe application.
| `close` | - | Closes the Adobe application.
| `dispose` | - | Closes Adobe Event Listener and rest of the `AdobeApp` components.

### Config

#### Config

| Method | Type | Description |
|:-------|:------------|:------------|
|  `app` | AdobeAppConfig | Adobe application config
|  `host` | string | Domain name of the server.
|  `port` | number | Port number on which the server is listening.
|  `appTimeout` | number | Time after which the application process will close. Useful when the application freezes.<br/>By default - `0` - this option is off.
|  `jsPath` | string | Location of the javaScript files. <br/>Default path is `"./js"`

#### AdobeAppConfig

| Method | Type | Description |
|:-------|:------------|:------------|
|  `name` | AdobeAppName | Adobe application name. <br/>eg. `AdobeAppName.Photoshop`
|  `path` | string | Path to the Adobe's app executable file.
|  `adobeScriptsPath` | string | Location of the `Scripts` directory of the selected Adobe app.

### Others

#### BroadcastMessage

| Property | Type | Description |
|:-------|:------------|:------------|
|  `command` | string | Command name
|  `stdout` | string | Standard output
|  `stderr` | string | Standard error

#### NewDocumentOptions

| Property | Type | Description |
|:-------|:------------|:------------|
|  `name` | string | Name of the document
|  `width` | number | Document width
|  `height` | number | Document height
|  `...` | any |  + other custom, optional properties

### Events

| Event | Description |
|:------|:------------|
| JS script file name | the event for a specific function called by the `runScript()` method
|`AdobeAppEvent.OpenApp` | -
|`AdobeAppEvent.CloseApp` | -
|`AdobeAppEvent.NewDocument` | - 
|`AdobeAppEvent.OpenDocument` | -
|`AdobeAppEvent.CloseDocument` | -
|`AdobeAppEvent.SaveDocument` | -

## Examples

### Basic example

```
import { newAdobeApp, AdobeAppName, AdobeAppEvent, AdobeApp, BroadcastMessage } from "adobe-node";

const sleep = (duration: number) => new Promise(resolve => { setTimeout(resolve, duration) });

const main = async () => {
    const app: AdobeApp = newAdobeApp({
        app: {
            name: AdobeAppName.Photoshop,
            path: '/Applications/Adobe Photoshop CC 2019/Adobe Photoshop CC 2019.app/Contents/MacOS/Adobe Photoshop CC 2019',
            adobeScriptsPath: '/Applications/Adobe Photoshop CC 2019/Presets/Scripts'
        },
        host: 'localhost',
        port: 5000
    });

    app.on(AdobeAppEvent.OpenApp, () => {
        console.log(`The Adobe App is open`);
    })
    .on(AdobeAppEvent.NewDocument, () => {
        console.log(`The document has been created`);
    })
    .on(AdobeAppEvent.OpenDocument, (data: any) => {
        console.log(`The document has been opened`);
    })
    .on(AdobeAppEvent.CloseDocument, () => {
        console.log(`The document has been closed`);
    })
    .on(AdobeAppEvent.CloseApp, () => {
        console.log(`The Adobe App has been closed`);
    })
    .on("test_script", (message: BroadcastMessage) => {
        console.log(`Testing custom script - ${message}`);
    });

    app.init();
    
    await app.open();
    await app.openDocument('/test1.psd');
    await sleep(2000);
    await app.closeDocument('/test1.psd');
    await sleep(2000);
    await app.close();
    app.dispose();
}

main();
```

### Running custom scripts
In Adobe applications you can run scripts in `JSFL` (Adobe Animate) and `JSX` (Photoshop, Illustrator etc.)<br>
One of the features of this module is the ability to run a custom scripts written in `javaScript`. <br>
There are a few things to explain, first of all this is the script template triggered in the selected Adobe application.

#### Template of Adobe Script

```
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
  })();
```
Texts between `{{}}` are replaced with values prepared for a specific event/command. The javaScript code is pasted in the `{{__fn__}}` placeholder.

As you can see `{{__fn__}}`/ JS code is assigned to the `__stdout` variable, this means that your javaScript code must be included in the `IIFE` function and it must also return a value - even if the logic doesn't require it - which will be passed in to the event.

```
// IIFE example
(function(){
    ... some magic
    return true; // whatever
}());
```

#### Running script without any arguments

```
...
await app.runScript('/some_custom_script.js');
...
```

#### Running script with arguments

```
...
await app.runScript('/some_custom_script.js', {
  title: "New Document",
  width: 1024,
  height: 768
});
...
```

The arguments/ options used in the `runScript()` method are pasted in the `{{__vars__}}` placeholder.<br>
These vars are also available in the `IIFE` function.

#### Generated Adobe Script

Here is an example of a generated script file that runs in Adobe app.

```
var ___new_document = (function() {
    var __stderr;
    var __stdout;
    
    try {
      var title = "New Document";
      var width = 1024;
      var height = 768;

      __stdout = (function(){
          var doc = app.documents.add(width, height, 72, title, NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
          return true;
      }());

    } catch (e) {
      __stderr = e;
    } finally {
      app.system("adobe-broadcast --host='localhost' --port=5000 --msg='{\"command\":\"new_document\",\"stdout\":\"" + __stdout + "\", \"stderr\":\"" + __stderr + "\" }'");
    }
  })();
```

The generated adobe scripts files - `jsx`/`jsfl` - are saved in the location specified in the `adobeScriptsPath` configuration.


**_Info_**: If there are no specific reasons against, it is better to use the default location of the Adobe application.