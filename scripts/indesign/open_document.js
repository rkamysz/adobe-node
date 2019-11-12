(function (documents) {

    for (var i in documents) {
        app.open(File(documents[i]));
    }

    return true;

}(documents));