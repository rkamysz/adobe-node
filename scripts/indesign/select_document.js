(function(document){
  
    var name = document.replace(/^.*?([^\\\/]*)$/, '$1');
    var doc = app.documents.itemByName(name);

    app.activeDocument = doc;

    return true;

  }(document));