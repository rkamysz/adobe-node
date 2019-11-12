(function(document){
  
    var name = document.replace(/^.*?([^\\\/]*)$/, '$1');
    var doc = app.documents[name];

    app.activeDocument = doc;

    return true;

  }(document));