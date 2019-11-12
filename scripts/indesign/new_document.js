(function () {
    var _title = "new_document";
    var _width = 500;
    var _height = 500;
    var _pageOrientation = PageOrientation.portrait;
    var _pagesPerDocument = 16

    try {
        _title = title;
    } catch (e) { }
    try {
        _width = width;
    } catch (e) { }
    try {
        _height = height;
    } catch (e) { }
    try {
        _pageOrientation = pageOrientation;
    } catch (e) { }
    try {
        _pagesPerDocument = pagesPerDocument;
    } catch (e) { }

    var doc = app.documents.add();

    with(doc.documentPreferences){
    	pageHeight = _height;
    	pageWidth = _width;
    	pageOrientation = _pageOrientation;
    	pagesPerDocument = _pagesPerDocument;
    }

    return true;
}());
