//handle to DOM elements
//var searchBtnEl = document.querySelector("#search-btn");
var searchTextEl = document.querySelector("#search-text");
var forecastWeatherContainerEl = document.querySelector('#forecast-container');
var todaysWeatherContainerEl = document.querySelector('#todays-weather');

var citiesContainerEl = document.getElementById("saved-cities-container");
var fiveDayForecastEL = document.getElementById("five-day-forecast-text");

//global variables
var apiKey = '84f1f04fe0b05f9704f36a0db8c8b0cf';
var city = 'San Francisco';

//curent date
var today = dayjs();

var latitude;
var longitude;

//localStorage
var savedCities;
//onInit check if there are saved cities in local sotgare, fetch and dis[lay buttons for each]
//else saved cities = [];
//update this array and save to local storage everytime the user clicks on searc and we have a valid city !!

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

// function getCordinates(data) {
//     console.log("get Cordinates: ", data);
// }

function updateSavedCities(searchedCity) {
    //when user click on search, save the city to local storage. if length of saved string is more than 8; remove the first itme and push ina the new city and save to localstorage
    savedCities = JSON.parse(localStorage.getItem('citiesArray')) || [];
    console.log("savedCities is: ", savedCities);

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
    console.log("savedCities TO DISPLAY ::: ", savedCities);
    citiesContainerEl.innerHTML = '';
    //create button for each saved city
    savedCities.forEach((city) => {
        console.log('city is: ', city);
        let button = document.createElement('button');
        button.textContent = city;
        button.classList.add('btn', 'btn-primary', 'btn-block');
        button.addEventListener('click', savedCityClicked);
        citiesContainerEl.appendChild(button);
        //create a button event listener for button clicks?
    });

}




function getGeolocationApi() {
    //geo location
    // var city = "San francisco"
    var geoCodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(geoCodingApiUrl)
    .then(function (response) {
        console.log("Geo response is : ", response, response.ok );
        if(response.ok) {
            return response.json();
        } else {
            // alert("No data to display !!" + response.statusText);
            ///clear contents of forecast and todays weather container !!
            forecastWeatherContainerEl.innerHTML = '';
            todaysWeatherContainerEl.innerHTML = '';
        }
    })
    .then(function (data) {
        if(data?.name) {
            console.log("Geo data : for ", data.name, "  ", data);
            //TODO
            //save this city to local storagesss
            updateSavedCities(data.name);

            getTodaysWeatherDetails(data);
            displayTodaysWeather();
            latitude = data?.coord?.lat;
            longitude = data?.coord?.lon;
            console.log("found coords for : ", data?.name, " lat: ", latitude, " longitude: ", longitude );

            //get its weather forecast.
            getWeatherApi();
        }

    })

}

function getWeatherApi() {
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(requestUrl)
        .then(function (response) {
            console.log("response is : ", response );
            if(response.ok) {
                return response.json();
            } else {
                // alert("No data to display !!" + response.statusText);
                forecastWeatherContainerEl.innerHTML = '';
                todaysWeatherContainerEl.innerHTML = '';
            }
        })
        .then(function (data) {
            console.log("Forecast weather data : ", data);
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
            let newParaHumidityText = document.createTextNode(`Wind: ${forecast.humidity}`);
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
    console.log("getTodaysWeatherDetails with : ", weatherData);
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
//    var todaysWeatherContainerEl = document.querySelector('#todays-weather');
   console.log("todaysWeatherContainerEl : ", todaysWeatherContainerEl);
   //clear the contents of the div.
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
    let newParaHumidityText = document.createTextNode(`Wind: ${todayWeather.humidity}`);
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
    // console.log("event is: ", event);
    // console.log("event is: ", searchTextEl);
    city = (searchTextEl.value).trim();
    // console.log("Current city is: ", city);
    if(city) {
        getGeolocationApi();
    } else {
        //instead of alert .. displaya  new div with "API error".
        //alert("Please enter a valid city name!");
        forecastWeatherContainerEl.innerHTML = '';
        todaysWeatherContainerEl.innerHTML = '';
    }
}

function savedCityClicked() {
    // city = this.textContent;
    console.log('button event: ', event);
    console.log('this : ', this);
    city = this.textContent;
    console.log('City is: ', city);
    getGeolocationApi();
}

//main funtion
function init() {
    displaySavedCities();
}

init();