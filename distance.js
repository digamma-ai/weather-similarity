
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

