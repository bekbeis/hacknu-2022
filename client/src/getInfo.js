function getJsonOfIndex(index) {
    const URL = `http://localhost:8080/get?ind${index}`
    options = {
        method: "METHOD",
        headers: { "Content-Type": "application/json" },
        };
    fetch( URL, options)
    .then( response =>(response.json()))
    then( json =>{
        console.log(json);
        return json;
    })
}