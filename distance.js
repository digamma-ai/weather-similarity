function loadData(cb) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'datadict.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            mapdict = json_parse(xobj.responseText);
            cb();
        }
    }
    xobj.send(null);
}
