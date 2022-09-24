function drawPath(max, map, coordinates, scene, color) {
    let path = []
    for (let i = 0; i < coordinates.length; i++) {
        path.push({lat: coordinates[i].Latitude, lng: coordinates[i].Longitude, alt: coordinates[i].Altitude})
    }
    console.log(path)
    const flightPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      flightPath.setMap(map);
}

export {drawPath};