(function (document, saveAs) {
  
  var name = document.replace(/^.*?([^\\\/]*)$/, '$1');

  app.documents.itemByName(name).save(new File(saveAs));

  return true;

}(document, saveAs));
