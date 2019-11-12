(function (document) {
  var docs = app.activeDocs;
  var name = document.replace(/^.*?([^\\\/]*)$/, '$1');

  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    if (doc.info.Title == name) {
      doc.bringToFront();
    }
  }
  
  return true;

}(document));