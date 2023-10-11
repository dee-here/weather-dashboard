//handle to DOM elements
//var searchBtnEl = document.querySelector("#search-btn");
var searchTextEl = document.querySelector("#search-text");
var forecastWeatherContainerEl = document.querySelector('#forecast-container');
var todaysWeatherContainerEl = document.querySelector('#todays-weather');

var citiesContainerEl = document.getElementById("saved-cities-container");
var fiveDayForecastEL = document.getElementById("five-day-forecast-text");
var inValidCityEl = document.getElementById("invalid-city");

//global variables
var apiKey = '84f1f04fe0b05f9704f36a0db8c8b0cf';
var city;

//curent date
var today = dayjs();

var latitude;
var longitude;

//localStorage
//update this array and save to local storage everytime the user clicks on search and we have a valid city !!
var savedCities;
//onInit check if there are saved cities in local sotgare, fetch and display buttons for each
//else saved cities = [];


class DayForecast {
    constructor(day, icon, temp, wind, humidity) {
        this.day = day;
        this.icon = icon; //use as a location for img tag
        this.temp = temp;
        this.wind = wind;
        this.humidity = humidity;
    }
}

var foreCastArray;
var todayWeather;

function updateSavedCities(searchedCity) {
    //when user click on search, save the city to local storage. 
    savedCities = JSON.parse(localStorage.getItem('citiesArray')) || [];
    console.log("savedCities is: ", savedCities);
    //if length of saved string is more than 8; remove the first iem and push in the new city and save to localstorage
    if(searchedCity && !savedCities.includes(searchedCity.trim())) {
        if(savedCities?.length > 7) {
            savedCities.shift();
        }
        savedCities.push(searchedCity);
        localStorage.setItem('citiesArray', JSON.stringify(savedCities));
    }
    displaySavedCities();

}

function displaySavedCities() {
    savedCities = JSON.parse(localStorage.getItem('citiesArray')) || [];
    citiesContainerEl.innerHTML = '';
    //create button for each saved city
    savedCities.forEach((city) => {
        let button = document.createElement('button');
        button.textContent = city;
        button.classList.add('btn', 'btn-primary', 'btn-block');
        button.addEventListener('click', savedCityClicked);
        citiesContainerEl.appendChild(button);
    });

}

function showInvalidCityMessage() {
    inValidCityEl.classList.remove('hidden');
}

function hideInvalidCityMessage() {
    inValidCityEl.classList.add('hidden');
}


function getGeolocationApi() {
    var geoCodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(geoCodingApiUrl)
    .then(function (response) {
        if(response.ok) {
            hideInvalidCityMessage();
            fiveDayForecastEL.classList.remove('hidden');
            return response.json();
        } else {
            ///clear contents of forecast and todays weather container !!
            forecastWeatherContainerEl.innerHTML = '';
            todaysWeatherContainerEl.innerHTML = '';
            fiveDayForecastEL.classList.add('hidden');
            showInvalidCityMessage();
            
        }
    })
    .then(function (data) {
        if(data?.name) {
            //save this city to local storagesss
            updateSavedCities(data.name);
            getTodaysWeatherDetails(data);
            displayTodaysWeather();
            latitude = data?.coord?.lat;
            longitude = data?.coord?.lon;
            //get its weather forecast.
            getWeatherApi();
        }

    })

}

function getWeatherApi() {
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(requestUrl)
        .then(function (response) {
            if(response.ok) {
                return response.json();
            } else {
                // alert("No data to display !!" + response.statusText);
                forecastWeatherContainerEl.innerHTML = '';
                todaysWeatherContainerEl.innerHTML = '';
            }
        })
        .then(function (data) {
            get5daysForecast(data?.list);
            // Display 5 days forecast !
            displayForecast();
        })

}

function get5daysForecast(weatherDataList) {
        //iterate over weather data and populate each day with index starting at 3 and + 8 for next days noon !
        foreCastArray = [];
            for (let i=0; i< weatherDataList?.length; i=i+8) {
                let day = weatherDataList[i]?.dt_txt;
                //format date to be consistent!
                day = dayjs(day.split(' ')[0]).format("MMMM D, YYYY");
                let icon = weatherDataList[i].weather[0]?.icon;
                let temp = weatherDataList[i].main?.temp;
                let wind = weatherDataList[i].wind?.speed + " MPH";
                let humidity = weatherDataList[i].main?.humidity;
                foreCastArray.push( new DayForecast(day, icon, temp, wind, humidity));
            }
}

function displayForecast() {
    // var forecastWeatherContainerEl = document.querySelector('#forecast-container');
    forecastWeatherContainerEl.innerHTML = '';
    if(foreCastArray?.length > 0) {
        fiveDayForecastEL.classList.remove('hidden');
        foreCastArray.forEach(forecast => {
            let newDiv = document.createElement('div');
            newDiv.classList.add('forecast');
        
            let newPara = document.createElement('p');
            let newParaText = document.createTextNode(forecast.day);
            newPara.appendChild(newParaText);
        
            let newImage = document.createElement('img');
            newImage.src = `http://openweathermap.org/img/w/${forecast.icon}.png`;
        
            let newParaTemp = document.createElement('p');
            let newParaTempText = document.createTextNode(`Temp: ${forecast.temp} \u00B0F`);
            newParaTemp.appendChild(newParaTempText);
        
            let newParaWind = document.createElement('p');
            let newParaWindText = document.createTextNode(`Wind: ${forecast.wind}`);
            newParaWind.appendChild(newParaWindText);
        
            let newParaHumidity = document.createElement('p');
            let newParaHumidityText = document.createTextNode(`Humidity: ${forecast.humidity}`);
            newParaHumidity.appendChild(newParaHumidityText);
        
            newDiv.appendChild(newPara);
            newDiv.appendChild(newImage);
            newDiv.appendChild(newParaTemp);
            newDiv.appendChild(newParaWind);
            newDiv.appendChild(newParaHumidity);
            forecastWeatherContainerEl.appendChild(newDiv);
        });
       }
}

function getTodaysWeatherDetails(weatherData) {
    if(weatherData) {
    let day = city + " " + today.format("MMMM D, YYYY");
    let icon = weatherData.weather[0]?.icon;
    let temp = weatherData.main?.temp;
    let wind = weatherData.wind?.speed + " MPH";
    let humidity = weatherData.main?.humidity;
    todayWeather = new DayForecast(day, icon, temp, wind, humidity);
    }

}

function displayTodaysWeather() {
   // clear the contents of the div.
   todaysWeatherContainerEl.innerHTML = '';
   if(todayWeather) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('forecast');

    let newPara = document.createElement('p');
    let newParaText = document.createTextNode(todayWeather.day);
    newPara.appendChild(newParaText);

    let newImage = document.createElement('img');
    newImage.src = `http://openweathermap.org/img/w/${todayWeather.icon}.png`;

    let newParaTemp = document.createElement('p');
    let newParaTempText = document.createTextNode(`Temp: ${todayWeather.temp} \u00B0F`);
    newParaTemp.appendChild(newParaTempText);

    let newParaWind = document.createElement('p');
    let newParaWindText = document.createTextNode(`Wind: ${todayWeather.wind}`);
    newParaWind.appendChild(newParaWindText);

    let newParaHumidity = document.createElement('p');
    let newParaHumidityText = document.createTextNode(`Humidity: ${todayWeather.humidity}`);
    newParaHumidity.appendChild(newParaHumidityText);

    newDiv.appendChild(newPara);
    newDiv.appendChild(newImage);
    newDiv.appendChild(newParaTemp);
    newDiv.appendChild(newParaWind);
    newDiv.appendChild(newParaHumidity);
    todaysWeatherContainerEl.appendChild(newDiv);
   }

}

function getSearchResults(event) {
    city = (searchTextEl.value).trim();
    if(city) {
        getGeolocationApi();
    } else {
        forecastWeatherContainerEl.innerHTML = '';
        todaysWeatherContainerEl.innerHTML = '';
    }
}

function savedCityClicked() {
    city = this.textContent;
    getGeolocationApi();
}

//main funtion
function init() {
    displaySavedCities();
}

init();