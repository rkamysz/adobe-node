(function (documents) {

    for (var i in documents) {
        var path = documents[i];
        var name = path.replace(/^.*?([^\\\/]*)$/, '$1');
        var doc = app.documents.itemByName(name);
        if(doc.saved) {
            doc.close(SaveOptions.yes);
        } else {
            doc.close(SaveOptions.yes, File(path));
        }
    }

    return true;

}(documents));
