# Weather dashboard
5 day weather forecast application that displays weather conditions for current day and forecasts for the next 5 days.


## Technology Used 

| Technology Used         | Resource URL           | 
| ------------- |-------------| 
| JavaScript    | [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | 
| HTML    | [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) | 
| CSS     | [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)      |   
| Git | [https://git-scm.com/](https://git-scm.com/)     |   
| Day.js | [https://day.js.org/](https://day.js.org/)     |  
| Bootstrap | [https://getbootstrap.com/docs/5.0/layout/grid/](https://getbootstrap.com/docs/5.0/layout/grid/)     |    

## Description
[Weather dashboard](https://dee-here.github.io/weather-dashboard/)

This application uses https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={APIkey}  web api to fetch curent and forecast conditions for the searched cty for the next 5 days.

It also stores the last 8 city names that were successfuly able to get weather conditions for into the local storage. The application removes the oldest cities after 8 unique cities. 
When the application first loads we get the saved cities in the local storage and display it as options for the user to click and see its weather conditions.

When a user enter an invalid city and clicks the search button, the user is shown an "Invalid city" message.

If the city name is correct and we are able to get its latitude and longitude from the weather API, we then use those cordinates to use the weather api to get the next 5 days weather forecast in 3 hour time slots.

The application parses this data and displays it for the user.

## Screen Recording
![Weather dashboard working gif](./assets/images/weather-3.gif)


## Author Info

Deepak Sinha

* [Portfolio](https://dee-here.github.io/portfolio/)
* [Github](https://github.com/dee-here)

