(function (document, saveAs) {
  var _selectionOnly = false;

  try {
    _selectionOnly = selectionOnly;
  } catch (e) { }

  var doc = fl.openDocument(document);
  doc.saveAs(saveAs, _selectionOnly);

  return true;

}(document, saveAs));
