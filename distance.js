/*
function loadData(cb) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'datadict.json', true);
    xobj.onreadystatechange = function () {
            alert(xobj.responseText.length)
        if (xobj.readyState == 4) {
        try{
            alert("GOT".length);
            mapdict = json_parse(xobj.responseText);
            alert(1);
            cb();
            alert(2);
            } catch(e) 
            {
            alert(e.error)
            }
        }
    }
    xobj.send(null);
}
*/

function weather_distance(from, to)
{
    var i=0;
    var d=0;
    for(i=0;i<12;i++)
        d=d+Math.abs(from[i]-to[i])
    return d;
}

function sortByDist(from)
{
    var lst=[];
    var i;
    var t0 = mapdict[from]["Temps"];
    for(i in mapdict)
    {
        if(i==from)
            continue; //skip self
        var x = mapdict[i];
        var t1 = x["Temps"];
        delete x["Temps"];
        x.dist = weather_distance(t0,t1);
        lst.push(x)
    }

    lst.sort(function(a,b)
             {
                 return a.dist - b.dist;
             });
    return lst;
}

