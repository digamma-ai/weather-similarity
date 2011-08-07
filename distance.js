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

function weather_distance(from, to)
{
    var ft=from["Temps"];
    var tt=to["Temps"];
    var i=0;
    var d=0;
    for(i=0;i<12;i++)
        d=d+Math.abs(ft[i]-tt[i])
    return d;
}