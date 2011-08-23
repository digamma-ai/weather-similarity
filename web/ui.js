
var SELECT_MODE = 0;
var SHOW_MODE   = 1;

var BASE_G_ICON_URL="http://www.google.com/intl/en_us/mapfiles/ms/micons/";

var mode = SELECT_MODE;
var map = null;
var current_station_id;
var infowindow = null;
var sorted = null;
var infowindow = null;
var mode = SELECT_MODE;

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

function iconUrl(zoomLevel, fname)
{
    if(zoomLevel<=2)
        return null;
    else if(zoomLevel<=6)
        return "img/"+fname;
    else
        return BASE_G_ICON_URL+fname;
}

function zoom_changed()
{
    var zoomLevel = map.getZoom();
    for(var i in mapdict)
    {
        var x = mapdict[i];
        if(mode = SELECT_MODE)
            x.Marker.setIcon(iconUrl(zoomLevel,"red-dot.png"));
        else if(i==current_station_id)
            x.Marker.setIcon(iconUrl(zoomLevel,"blue-dot.png"));
        else
            x.Marker.setIcon(iconUrl(zoomLevel,"green-dot.png"));
    }
}

function init() 
{      
    for(i in mapdict)
    {
        var x = mapdict[i];
        x.position = new google.maps.LatLng(x.Lat, -1*x.Long);
    }

    var center = new google.maps.LatLng(37.257266,-122.03396);
    var options = {
        zoom: 9,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), options);
    createMarkers();
    google.maps.event.addListener(map, 'zoom_changed', zoom_changed);
}

function createMarkers()
{
    var i;
    for(i in mapdict)
    {
        var x = mapdict[i];
        
        var marker = new google.maps.Marker({
            position: x.position, 
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
            content: x.Name + ", " + x.Country + "<br><div style='width:800px;height:400px' id=\"mrk"+x.Number+"\"></div>"
        });
    google.maps.event.addListener(marker, 'click', function() {
        if(mode == SHOW_MODE)
        {
            if(infowindow != null)
                infowindow.close();
            infowindow = _infowindow;
            infowindow.open(map,marker);
            google.maps.event.addListener(_infowindow, 'domready', function() {
                showChart(x.Number);
            });
        }
        else if(mode == SELECT_MODE)
        {
            selectStation(x.Number);
        }
        
    });
}

function showChart(id)
{
    var x0 = mapdict[current_station_id];
    var x1 = mapdict[id];
    var t0 = x0.Temps;
    var t1 = x1.Temps;
    var n0 = x0.Name+","+x0.Country;
    var n1 = x1.Name+","+x1.Country;

    var data = new google.visualization.DataTable();
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    data.addColumn('string', 'Month');
    data.addColumn('number', n0);
    data.addColumn('number', n1);

    data.addRows(12);
    
    for (var i = 0; i < 12; i++)
    {
        data.setValue(i, 0, monthNames[i]);    
        data.setValue(i, 1, t0[i]);    
        data.setValue(i, 2, t1[i]);    
    }
    
    new google.visualization.ColumnChart(get('mrk'+id)).
    draw(data,
         {title:"Average Monthly Temperatures (degree Celsius)",
          width:600, height:400,
          hAxis: {title: "Month"}}
  );
}

function selectStation(id)
{
    current_station_id = id;

    var current_station = mapdict[current_station_id];

    get("current_station").innerHTML = 
        '<a href="#" onclick="centerOnCity('+id+')">'+
        current_station.Name + ", " + mapdict[current_station_id].Country+
        "</a>";
    
    current_station.Marker.setIcon(iconUrl(map.getZoom(),"blue-dot.png"));
    current_station.Marker.setVisible(true);

    sorted = sortBySimilarity(current_station_id);
    A_SLIDERS[0].f_setValue(0);

    map.setCenter(current_station.position);

    hideDissimilarMarkers(0);
    
    get("controls").style.display="block";
    mode = SHOW_MODE;
}

function showAllMarkers()
{
    if(infowindow != null)
        infowindow.close();
    
    var zoomLevel = map.getZoom();
    for(var i in mapdict)
    {
        mapdict[i].Marker.setVisible(true);
        mapdict[i].Marker.setIcon(iconUrl(zoomLevel,"red-dot.png"));
    }
}

function hideDissimilarMarkers(simp)
{
    if (!sorted)
    	return;
    var minsimilarity=sorted[0].similarity;
    var maxsimilarity=sorted[300].similarity;
    var sim;
    if(simp==0)
        sim = minsimilarity;
    else
        sim = minsimilarity + ((maxsimilarity - minsimilarity)/100)*simp;

    var zoomLevel = map.getZoom();
    var n=0;
    for(var i=0;i<sorted.length;i++)
    {
        var x=sorted[i];
        if(x.similarity <= sim) {
            x.Marker.setIcon(iconUrl(zoomLevel,"green-dot.png"));
            x.Marker.setVisible(true);
            n++;
        } else
        {
            x.Marker.setVisible(false);
        }
    }
    showMatches(sim)
}

function changeStation()
{
    mode = SELECT_MODE;
    get("current_station").innerHTML = "";
    get("controls").style.display="none";
    showAllMarkers();
}

function centerOnCity(id)
{
    map.setCenter(mapdict[id].position);
}

function showMatches(sim)
{
    var tbl = get('tblMatches');
    while(tbl.rows.length>1) //so header line won't be deleted
        tbl.deleteRow(tbl.rows.length-1);
    
    var maxsimilarity = sorted[sorted.length-1].similarity;
    for(var i=0;i<sorted.length;i++)
    {
        var x=sorted[i];
        if(x.similarity > sim) 
            break;
        var row = tbl.insertRow(tbl.rows.length);

        var c0 = row.insertCell(0);
        var lnk = document.createElement("a");
        lnk.setAttribute("href","#");
        lnk.setAttribute("onclick","centerOnCity(\""+x.id+"\")");
        lnk.appendChild(document.createTextNode(x.Name));
        c0.appendChild(lnk);

        var c1 = row.insertCell(1);
        c1.appendChild(document.createTextNode(x.Country));

        var c2 = row.insertCell(2);
        var distance = Math.round(x.dist/1000);
        c2.appendChild(document.createTextNode(distance+"km"));

        var c3 = row.insertCell(3);
        var similarityp = Math.round(100*(maxsimilarity-x.similarity)/maxsimilarity);
        c3.appendChild(document.createTextNode(""+similarityp+"%"));
        

    }
}