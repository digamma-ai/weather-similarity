function loadData() {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'datadict.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            document.getElementById("mapdict").innerHTML = 
                eval(xobj.responseText);
        }
    }
    xobj.send(null);
}
