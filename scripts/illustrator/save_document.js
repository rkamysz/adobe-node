(function (documents) {

  var rootDoc = app.activeDocument;

  for (var i in documents) {
    var name = documents[i].replace(/^.*?([^\\\/]*)$/, '$1');
    var doc = app.documents[name];
    app.activeDocument = doc;
    doc.save();
  }
  app.activeDocument = rootDoc;
  return true;

}(documents));