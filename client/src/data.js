const data = [
    {
        "Latitude": 51.50843075,
        "Longitude": -0.098585086,
        "Altitude": 0.658117563,
        "Identifier": "Alice",
        "Timestamp": 210541,
        "Floor label": null,
        "Horizontal accuracy": 2.3764,
        "Vertical accuracy": 5.484818,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.50817223,
        "Longitude": -0.09859787,
        "Altitude": 0.184600579,
        "Identifier": "Alice",
        "Timestamp": 271786,
        "Floor label": null,
        "Horizontal accuracy": 2.8573,
        "Vertical accuracy": 5.18274,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.50840261,
        "Longitude": -0.098512051,
        "Altitude": 1.118900953,
        "Identifier": "Alice",
        "Timestamp": 346999,
        "Floor label": null,
        "Horizontal accuracy": 2.9853,
        "Vertical accuracy": 5.4228294,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.5086788,
        "Longitude": -0.09849205,
        "Altitude": 6.840080482,
        "Identifier": "Alice",
        "Timestamp": 412323,
        "Floor label": null,
        "Horizontal accuracy": 2.55035,
        "Vertical accuracy": 2.325053,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.50917358,
        "Longitude": -0.098467999,
        "Altitude": 6.819855914,
        "Identifier": "Alice",
        "Timestamp": 496645,
        "Floor label": null,
        "Horizontal accuracy": 2.98437,
        "Vertical accuracy": 5.13931,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.50959378,
        "Longitude": -0.098424099,
        "Altitude": 6.819979518,
        "Identifier": "Alice",
        "Timestamp": 556118,
        "Floor label": null,
        "Horizontal accuracy": 3.292342,
        "Vertical accuracy": 5.420242,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.51008767,
        "Longitude": -0.09837941,
        "Altitude": 7.177107181,
        "Identifier": "Alice",
        "Timestamp": 616721,
        "Floor label": null,
        "Horizontal accuracy": 2.45881,
        "Vertical accuracy": 4.92494,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.51052555,
        "Longitude": -0.098353134,
        "Altitude": 7.141268689,
        "Identifier": "Alice",
        "Timestamp": 691282,
        "Floor label": null,
        "Horizontal accuracy": 2.443,
        "Vertical accuracy": 3.450505,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.51085497,
        "Longitude": -0.098416265,
        "Altitude": 0.201714834,
        "Identifier": "Alice",
        "Timestamp": 765795,
        "Floor label": null,
        "Horizontal accuracy": 2.91781,
        "Vertical accuracy": 4.30202,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    },
    {
        "Latitude": 51.51116061,
        "Longitude": -0.098394436,
        "Altitude": 0.234116077,
        "Identifier": "Alice",
        "Timestamp": 834246,
        "Floor label": null,
        "Horizontal accuracy": 3.928974,
        "Vertical accuracy": 3.204045,
        "Confidence in location accuracy": 0.6827,
        "Activity": "walking"
    }
];

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