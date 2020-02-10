# adobe-node
Control Adobe applications - such as Photoshop, Animate, Illustrator, InDesign - from node. Run JavaScript to remotely - from the command line - create, modify or export document content. This module can be used to automate the workflow by creating an action chain that can be executed without user intervention.

More information about writing scripts for Adobe applications:
- [Photoshop, Illustrator, InDesign etc. scripting center](https://www.adobe.com/devnet/scripting.html)
- [Adobe Animate JavaScript API](https://help.adobe.com/archive/en_US/flash/cs5/flash_cs5_extending.pdf)

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
| `selectDocument` | document: string | Brings selected document to the front of the screen.
| `saveDocument` | ...documents: string[] | Saves changes.
| `saveAsDocument` | document: string,<br/>saveAs: string,<br/>options: object | Saves the document in a specific format and location. Optionally you can specify the save options appropriate to the format. <br>_For more information on these options, see the script documentation for the selected Adobe product._
| `openDocument` | ...documents: string[] | Opens documents.
| `closeDocument` | ...documents: string[] | Closes documents.
| `saveAndCloseDocument` | ...documents: string[] | Saves changes and closes the documents.
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
|  `title` | string | Name of the document
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
|`AdobeAppEvent.SelectDocument` | -
|`AdobeAppEvent.SaveDocument` | -
|`AdobeAppEvent.SaveAsDocument` | -
|`AdobeAppEvent.SaveAndCloseDocument` | -

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
These vars are also available in the `IIFE`.

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

## To Do
- implement more and improve built-in scripts

## Changelog

## 2.0.0
### Added
- __API__ `selectDocument()`
- __API__ `saveAsDocument()`
- __API__ `saveAndCloseDocument()` 
- Build-in scripts (currently only for Photoshop and Animate)
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/open_document.js`
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/new_document.js`
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/save_document.js`
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/save_as_document.js`
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/close_document.js`
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/save_and_close_document.js`
  - `adobe-node/scripts/photoshop|animate|illustrator|indesign|after_effects|acrobat/select_document.js`

### Changed
- __API__ `saveDocument()` - removed optional argument `saveAs`, saving multiple documents in one call.


## Tips

If the Adobe application does not start, try to:

* Change the access/permissions settings to the directory set in the `adobeScriptsPath` param
eg.
```
sudo chown <username> "/Applications/Adobe Photoshop CC 2019/Presets/Scripts/"
```

* It is also possible that you will need to change user config to enable custom scripts.
For example, for Photoshop, add `WarnRunningScripts 0` to the `PSUserConfig.txt` file in the Photoshop settings folder and restart Photoshop.

If any of the built-in functions does not work as you expected, you can write these functions yourself and run them via the `runScript()` method.



## Contribute
Feel free to contribute. If you have any ideas, requests just leave a message.

## Info

I'm not using Adobe applications, so it may happen that one of the built-in scripts does not work properly or is not optimal. I wrote it based on available resources. If you find an error or you think the script should be written in a different way. Let me know or even better implement your solution and I will add it.

## License

Copyright (c) 2019 Radoslaw Kamysz

Licensed under the [MIT license](LICENSE).
