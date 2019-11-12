(function (documents) {

    for (var i in documents) {
        var name = documents[i].replace(/^.*?([^\\\/]*)$/, '$1');
        app.documents[name].close(SaveOptions.DONOTSAVECHANGES);
    }

    return true;

}(documents));
