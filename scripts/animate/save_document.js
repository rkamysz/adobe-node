(function (documents) {
  for (var i in documents) {
    var doc = fl.openDocument(documents[i]);
    doc.save();
  }
  return true;

}(documents));