const apiOptions = {
    apiKey: 'AIzaSyD6Iizn9Jsf5b69Hghc8TJLc1KqK0Z3BX0',
    version: "beta"
};

const mapOptions = {
    "tilt": 0,
    "heading": 0,
    "zoom": 18,
    "center": { lat: 37.8123988, lng: -122.3626517 },
    "mapId": "ca8e921ae1e995d0"    
};

const data = [
    { lat: 37.8123988, lng: -122.3626517, alt: 58.43987247 },
    { lat: 52.37143359, lng: 4.904098515, alt: -1.308533509 },
    { lat: 52.37130446, lng: 4.903811829, alt: -0.011311007 },
    { lat: 52.37110056, lng: 4.904112411, alt: -0.435420848 },
    { lat: 37.8123988, lng: -122.3626517, alt: 6.163646818 }
];

export {apiOptions, mapOptions, data};