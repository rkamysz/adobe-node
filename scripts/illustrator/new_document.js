(function () {
    
    var _documentColorSpace = DocumentColorSpace.RGB;
    var _width = 500;
    var _height = 500;
    var _numArtBoards = 1;
    var _artboardLayout = 1;
    var _artboardSpacing = 1;
    var _artboardRowsOrCols = 1;

    try {
        _documentColorSpace = documentColorSpace;
    } catch (e) { }
    try {
        _width = width;
    } catch (e) { }
    try {
        _height = height;
    } catch (e) { }
    try {
        _numArtBoards = numArtBoards;
    } catch (e) { }
    try {
        _artboardLayout = artboardLayout;
    } catch (e) { }
    try {
        _artboardSpacing = artboardSpacing;
    } catch (e) { }
    try {
        _artboardRowsOrCols = artboardRowsOrCols;
    } catch (e) { }

    app.documents.add(_documentColorSpace, _width, _height, _numArtBoards, _artboardLayout, _artboardSpacing, _artboardRowsOrCols);

    return true;
}());
