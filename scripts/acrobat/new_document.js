(function () {
    var _title = "new_document";
    var _width = 612;
    var _height = 792;
    
    try {
        _title = title;
    } catch (e) { }
    try {
        _width = width;
    } catch (e) { }
    try {
        _height = height;
    } catch (e) { }
    

    app.newDoc(_width, _height);
    return true;
}());
