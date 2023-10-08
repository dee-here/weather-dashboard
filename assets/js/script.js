//handle to DOM elements
//var searchBtnEl = document.querySelector("#search-btn");
var searchTextEl = document.querySelector("#search-text");

//global variables
var apiKey = '84f1f04fe0b05f9704f36a0db8c8b0cf';
var city = 'San Francisco'

var latitude;
var longitude;

//localStorage
var savedCities;
//onInit check if there are saved cities in local sotgare, fetch and dis[lay buttons for each]
//else saved cities = [];
//update this array and save to local storage everytime the user clicks on searc and we have a valid city !!

class DayForecast {
    constructor(day, icon, temp, wind) {
        this.day = day;
        this.icon = icon; //use as a location for img tag
        this.temp = temp;
        this.wind = wind;
    }
}

var forCastArray;

function getCordinates(data) {
    console.log("get Cordinates: ", data);
}

function updateSavedCities() {
    //when user click on search, save the city to local storage. if length of saved string is more than 8; remove the first itme and push ina the new city and save to localstorage
}

function displaySavedCities() {
    
}




function getGeolocationApi() {
    //geo location
    // var city = "San francisco"
    var geoCodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(geoCodingApiUrl)
    .then(function (response) {
        console.log("Geo response is : ", response );
        return response.json();
    })
    .then(function (data) {
        console.log("Geo data : ", data);
        //thing = data;
        // get cordinates !
        // latitude = Math.abs((data?.coord?.lat)?.toFixed(2));
        // longitude = Math.abs((data?.coord?.lon)?.toFixed(2));
        latitude = data?.coord?.lat;
        longitude = data?.coord?.lon;
        console.log("found coords for : ", data?.name, " lat: ", latitude, " longitude: ", longitude );
        getWeatherApi();
    })

}

function getWeatherApi() {
    //var requestUrl = 'https://api.github.com/orgs/nodejs/repos'; api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    //weather !!

    //Id is determining the city.. change to latitude and longitude once geolocation funx ready.
    //var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    var thing;

    //get the geo cordinates for the city before getting weather!

    fetch(requestUrl)
        .then(function (response) {
            console.log("response is : ", response );
            return response.json();
        })
        .then(function (data) {
            console.log("weather data : ", data);
            //maybe not modify datsa!
            data = data?.list;
            foreCastArray = [];
            for (let i=3; i< 39; i=i+8) {
                var day = data[i]?.dt_txt;
                var icon = data[i].weather[0]?.icon;
                var temp = data[i].main?.temp;
                var wind = data[i].wind?.speed + " MPH";

                foreCastArray.push( new DayForecast(day, icon, temp,wind));
            }
            console.log("forecast is: ", foreCastArray);
        })

}

function get5daysForecast() {

        //iterate over weather data and populate each day with index starting at 3 and + 8 for next days noon !

}

function getSearchResults(event) {
    console.log("event is: ", event);
    console.log("event is: ", searchTextEl);
    city = (searchTextEl.value).trim();
    console.log("Current city is: ", city);
    if(city) {
        getGeolocationApi();
    } else {
        alert("Please enter a valid city name!");
    }

    // getApi();
}

//main funtion
function init() {

}