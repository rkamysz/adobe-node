(function (documents) {

    for (var i in documents) {
        var name = documents[i].replace(/^.*?([^\\\/]*)$/, '$1');
        for(var i in fl.documents) {
            var doc = fl.documents[i];
            if(doc.name === name) {
                doc.save();
                fl.closeDocument(doc, false);
            }
        }
    }

    return true;

}(documents));
