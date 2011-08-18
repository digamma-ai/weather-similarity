function get(id)
{
    return document.getElementById(id);
}

Array.prototype.contains = function(obj) 
{
    var i = this.length;
    while (i--) 
    {
        if (this[i] === obj) 
        {
            return true;
        }
    }
    return false;
}

function init() 
{
    var center = new google.maps.LatLng(37.257266,-122.03396);
    var options = {
        zoom: 9,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), options);
    
    createMarkers();
}

function createMarkers()
{
    var i;
    for(i in mapdict)
    {
        var x = mapdict[i];
        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(x.Lat, -1*x.Long), 
            map: map, 
            title: x.Name
        }); 
        
        attachNumber(marker, x);
        x.Marker = marker;
    }
}


function attachNumber(marker, x) 
{
    if(infowindow != null)
        infowindow.close();
    
    var _infowindow = new google.maps.InfoWindow(
        { 
            content: x.Name + ", " + x.Country,
            size: new google.maps.Size(50,50)
        });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow = _infowindow;
        infowindow.open(map,marker);
        markerClicked(x.Number);
    });
}

function markerClicked(id)
{
    if(mode == SELECT_MODE)
    {
        current_station_id = id; 
        get("current_station").innerHTML = mapdict[current_station_id].Name + ", " + mapdict[current_station_id].Country;
        get("change_button").disabled = false;
        
        mapdict[current_station_id].Marker.setIcon("http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png");
        mapdict[current_station_id].Marker.setVisible(true);

        sorted = sortByDist(current_station_id);
        A_SLIDERS[0].f_setValue(0);
        hideDistantMarkers(0);
        
        mode = SHOW_MODE;
    } else if(mode == SHOW_MODE)
    {
        //TODO: what to do here?
    }
}

function showAllMarkers()
{
    if(infowindow != null)
        infowindow.close();
    
    var i;
    for(i in mapdict)
    {
        mapdict[i].Marker.setVisible(true);
        mapdict[i].Marker.setIcon("http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png");
    }
}

function hideDistantMarkers(dstp)
{
    console.log("hideDistantMarkers called "+dstp);
    if (!sorted)
    	return;
    var mindist=sorted[0].dist;
    var maxdist=sorted[300].dist;
    var dst;
    if(dstp==0)
        dst = mindist;
    else
        dst = mindist + ((maxdist - mindist)/100)*dstp;
    var n=0;
    for(var i=0;i<sorted.length;i++)
    {
        var x=sorted[i];
        if(x.dist <= dst) {
            x.Marker.setIcon("http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png");
            x.Marker.setVisible(true);
            n++;
        } else
        {
            x.Marker.setVisible(false);
        }
    }
    console.log("found: "+n);
}

function changeStation()
{
    mode = SELECT_MODE;
    get("change_button").disabled = true;
    get("current_station").innerHTML = "";
    showAllMarkers();
}
