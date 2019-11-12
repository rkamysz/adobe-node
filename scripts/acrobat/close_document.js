(function (documents) {

    var docs = app.activeDocs;

    for (var d in documents) {
        var path = documents[d];
        var name = path.replace(/^.*?([^\\\/]*)$/, '$1');
        for (var i=0; i < docs.length; i++) {
            var doc = docs[i];
            if (doc.info.Title == name) {
                doc.close(true);
            }
        }
    }

    return true;

}(documents));
