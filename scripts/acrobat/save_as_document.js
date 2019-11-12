(function (document, saveAs) {
  var name = document.replace(/^.*?([^\\\/]*)$/, '$1');
  var docs = app.activeDocs;

  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    if (doc.info.Title == name) {
      doc.saveAs(saveAs);
    }
  }

  return true;

}(document, saveAs));
