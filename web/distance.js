
function weather_similarity(from, to)
{
    var i=0;
    var d=0;
    for(i=0;i<12;i++)
        d=d+Math.pow(Math.abs(from[i]-to[i]),2)
    return Math.sqrt(d);
}

function sortBySimilarity(from)
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
        x.similarity = weather_similarity(t0,t1);
        x.id = i;
        lst.push(x)
    }

    lst.sort(function(a,b)
             {
                 return a.similarity - b.similarity;
             });
    return lst;
}
