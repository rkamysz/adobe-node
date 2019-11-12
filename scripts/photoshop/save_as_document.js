(function (document, saveAs) {
  var _options = { typename: PhotoshopSaveOptions };
  var _asCopy = false;
  var _extensionType = Extension.NONE;
  var name = document.replace(/^.*?([^\\\/]*)$/, '$1');

  try {
    _options = options;
  } catch (e) { }
  try {
    _asCopy = asCopy;
  } catch (e) { }
  try {
    _extensionType = extensionType;
  } catch (e) { }

  app.documents[name].saveAs(File(saveAs), _options, _asCopy, _extensionType);

  return true;

}(document, saveAs));
