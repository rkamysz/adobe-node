(function (documents) {

  var rootDoc = app.activeDocument;

  for (var i in documents) {
    var path = documents[i];
    var name = path.replace(/^.*?([^\\\/]*)$/, '$1');
    var doc = app.documents.itemByName(name);
    app.activeDocument = doc;

    if (doc.saved) {
      doc.save();
    } else {
      doc.save(new File(path));
    }
  }
  app.activeDocument = rootDoc;
  return true;

}(documents));