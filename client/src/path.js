function drawPath(map, coordinates, color) {
    let path = []
    let drawSpeed = []
    for (let i = 0; i < coordinates.length; i++) {
        path.push({lat: coordinates[i].Latitude, lng: coordinates[i].Longitude, alt: coordinates[i].Altitude})
    }
    for (let i = 0; i < coordinates.length-1; i++) {
        drawSpeed.push(Math.abs(coordinates[i+1].Timestamp - coordinates[i].Timestamp)/100);
    }
    const flightPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      animatePolyline(flightPath, map, path, drawSpeed);
      flightPath.setMap(map);
}
function animatePolyline(line, map, path, drawSpeedArr) {
    var i = 0, m = 0, drawSpeed = drawSpeedArr[0];
    var linePartArr = []
    var pause = false;
    var pauseLineRemove = 1500;
    var pauseRedrawLine = 1000;
    setInterval(function () {
        drawSpeed = drawSpeedArr[m];
        //check if the end of the array is reached
        if (i + 1 == path.length && !pause) {
            pause = true;
 
            //remove all the line parts, optionally with a delay to keep the fully drawn line on the map for a while
            setTimeout(function () {
                for (var j = 0; j < linePartArr.length; j++) {
                    linePartArr[j].setMap(null);
                }
 
                linePartArr = [];
            }, pauseLineRemove);
 
            //delay the drawing of the next animated line
            // setTimeout(function () {
            //     pause = false;
            //     i = 0;
            // }, pauseRedrawLine + pauseLineRemove);
        }
 
        //create a line part between the current and next coordinate
        if (!pause) {
            var part = [];
            part.push(path[i]);
            part.push(path[i + 1]);
 
            //create a polyline
            var linePart = new google.maps.Polyline({
                path: part,
                strokeColor: '#ff0000',
                strokeOpacity: 1,
                strokeWeight: 5,
                zIndex: i + 1,
                map: map
            });
 
            //add the polyline to an array
            linePartArr.push(linePart);
            i++;
            if (m < drawSpeedArr.length - 1) m++;
            else m = 0;
        }
 
    }, drawSpeed);
    
}
export {drawPath};