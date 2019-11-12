(function (documents) {

    for (var i in documents) {
        fl.openDocument(documents[i]);
    }

    return true;

}(documents));