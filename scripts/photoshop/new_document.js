(function () {
    var _title = "new_document";
    var _width = 500;
    var _height = 500;
    var _resolution = 72;
    var _newDocumentMode = NewDocumentMode.RGB;
    var _initialFill = DocumentFill.TRANSPARENT;
    var _pixelAspectRatio = 1;
    var _bitsPerChannel = BitsPerChannelType.EIGHT;

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
        _resolution = resolution;
    } catch (e) { }
    try {
        _newDocumentMode = newDocumentMode;
    } catch (e) { }
    try {
        _initialFill = initialFill;
    } catch (e) { }
    try {
        _pixelAspectRatio = pixelAspectRatio;
    } catch (e) { }
    try {
        _bitsPerChannel = bitsPerChannel;
    } catch (e) { }

    app.documents.add(_width, _height, _resolution, _title, _newDocumentMode, _initialFill, _pixelAspectRatio, _bitsPerChannel);
    return true;
}());
