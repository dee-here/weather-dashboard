//handle to DOM elements
//var searchBtnEl = document.querySelector("#search-btn");
var searchTextEl = document.querySelector("#search-text");


function getSearchResults(event) {
    console.log("event is: ", event);
    console.log("event is: ", searchTextEl);
    getApi();
}

function getApi() {
    //var requestUrl = 'https://api.github.com/orgs/nodejs/repos'; api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    var apiKey = '84f1f04fe0b05f9704f36a0db8c8b0cf';
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;

    var thing;

    fetch(requestUrl)
        .then(function (response) {
            console.log("response is : ", response );
            return response.json();
        })
        .then(function (data) {
            console.log("data : ", data);
            thing = data;
        })

}

//main funtion
function init() {

}