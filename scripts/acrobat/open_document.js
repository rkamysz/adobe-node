(function (documents) {

    for (var i in documents) {
        app.openDoc(documents[i]);
    }

    return true;

}(documents));