
function array_shift_by(a,n)
{
    var res = a.slice(0)
    while(n--)
        res.push(res.shift());
    return res;
}

function euclidian_distance(from, to)
{
    var i=0;
    var d=0;
    for(i=0;i<12;i++)
        d=d+Math.pow(Math.abs(from[i]-to[i]),2)
    return Math.sqrt(d);
}

function weather_similarity(from, to, do_shift)
{
    if(!do_shift)
        return [euclidian_distance(from, to), 0]
    
    var md = euclidian_distance(from, to);
    var mi = 0;
    for(i=1;i<12;i++)
    {
        to.push(to.shift());
        var d = euclidian_distance(from, to);
        if(d<md)
        {
            md = d;
            mi = i;
        }
    }
    to.push(to.shift());
    return [md, mi]
}

function sortBySimilarity(from, do_shift)
{
    var lst=[];
    var i;
    var t0 = mapdict[from].Temps;
    var p0 = mapdict[from].position;
    for(i in mapdict)
    {
        if(i==from)
            continue; //skip self
        var x = mapdict[i];
        var t1 = x["Temps"];
        var tmp = weather_similarity(t0,t1, do_shift);
        x.similarity = tmp[0];
        x.month_offset = tmp[1];
        x.dist = google.maps.geometry.spherical.computeDistanceBetween(x.position, p0);
        x.id = i;
        lst.push(x)
    }

    lst.sort(function(a,b)
             {
                 return a.similarity - b.similarity;
             });
    return lst;
}

