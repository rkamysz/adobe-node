(function (document, saveAs) {
  var name = document.replace(/^.*?([^\\\/]*)$/, '$1');

  app.documents[name].saveAs(new File(saveAs));

  return true;

}(document, saveAs));
