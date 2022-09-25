const apiLink = 'localhost:8080/get_all'
const response = fetch(apiLink)
const data = response.json()
        const apiOptions = {
    apiKey: 'AIzaSyD6Iizn9Jsf5b69Hghc8TJLc1KqK0Z3BX0',
    version: "beta"
};

const mapOptions = {
    "tilt": 0,
    "heading": 0,
    "zoom": 18,
    "center": { lat: data[0].Latitude, lng: data[0].Longitude },
    "mapId": "ca8e921ae1e995d0"    
};

export {apiOptions, mapOptions, data};