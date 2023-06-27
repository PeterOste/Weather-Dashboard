var APIKey = "30be1111837fac08219d0c856c8d8a6d";
var searchFormEl = document.getElementById("search-form");
var cityInputEl = document.getElementById("city-input");
var cityNameEl = document.getElementById("city-name");
var dateEl = document.getElementById("date");
var weatherIconEl = document.getElementById("weather-icon");
var temperatureEl = document.getElementById("temperature");
var windSpeedEl = document.getElementById("wind-speed");
var humidityEl = document.getElementById("humidity");
var errorMessageEl = document.getElementById("error-message");
var currentWeatherEl = document.getElementById("current-weather");
var forecastSectionEl = document.getElementById("forecast-section");
var forecastContainerEl = document.getElementById("forecast-container");
var searchHistorySectionEl = document.getElementById("search-history-section");
var searchHistoryListEl = document.getElementById("search-history-list");

var searchHistory = [];

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if(!city){
        errorMessageEl.textContent = "Enter a city name!";
        return;
    }

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error: " + response.status);
            }    
        })
        .then(function (data) {

            cityNameEl.textContent = data.name;
            temperatureEl.textContent = "Temperature: " + data.main.temp + "°F";
            windSpeedEl.textContent = "Wind Speed: " + data.wind.speed + " mph";
            humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
            errorMessageEl.textContent = "";

            var iconCode = data.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"
            weatherIconEl.src = iconURL;

            var currentDate = new Date();
            dateEl.textContent = "Date: " + currentDate.toLocaleDateString();

            var forecastURL = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial'; // forest instead of weather

            fetch(forecastURL)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error: " + response.status);
                    }
                })
                .then (function (forecastData) {
                    forecastContainerEl.innerHTML = ""; // Clear previous forecast data
                    console.log(forecastData);
                    for (var i = 0; i < forecastData.list.length; i += 8) {
                        var forecastItem = forecastData.list[i];
                        var forecastDate = new Date(forecastItem.dt * 1000);
                        var forecastIconCode = forecastItem.weather[0].icon;
                        var forecastIconURL = "http://openweathermap.org/img/wn/" + forecastIconCode + ".png";
                        var forecastTemperature = forecastItem.main.temp;
                        var forecastWindSpeed = forecastItem.wind.speed;
                        var forecastHumidity = forecastItem.main.humidity;
            
                        var forecastCardEl = document.createElement("div");
                        forecastCardEl.classList.add("forecast-card");
            
                        var forecastDateEl = document.createElement("p");
                        forecastDateEl.textContent = forecastDate.toLocaleDateString();
                        forecastCardEl.appendChild(forecastDateEl);
            
                        var forecastIconEl = document.createElement("img");
                        forecastIconEl.src = forecastIconURL;
                        forecastIconEl.alt = "Forecast Weather Icon";
                        forecastCardEl.appendChild(forecastIconEl);
            
                        var forecastTemperatureEl = document.createElement("p");
                        forecastTemperatureEl.textContent = "Temperature: " + forecastTemperature + "°F";
                        forecastCardEl.appendChild(forecastTemperatureEl);
            
                        var forecastWindSpeedEl = document.createElement("p");
                        forecastWindSpeedEl.textContent = "Wind Speed: " + forecastWindSpeed + " mph";
                        forecastCardEl.appendChild(forecastWindSpeedEl);
            
                        var forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.textContent = "Humidity: " + forecastHumidity + "%";
                        forecastCardEl.appendChild(forecastHumidityEl);
            
                        forecastContainerEl.appendChild(forecastCardEl);    
                    }
                })
                .catch(function (error) {
                    errorMessageEl.textContent = "An error occurred: " + error.message;
                });

           // addToSearchHistory(data.name);
        })
        .catch(function (error) {
            errorMessageEl.textContent = "An error occurred: " + error.message;
        });

    currentWeatherEl.classList.remove("hidden");
    forecastSectionEl.classList.remove("hidden");
    searchHistorySectionEl.classList.remove("hidden");

    addToSearchHistory(city);
}

function addToSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        var liEl = document.createElement("li");
        liEl.textContent = city;
        searchHistoryListEl.appendChild(liEl);
    }
}

function handleSearchHistoryClick(event) {
    var clickedCity = event.target.textContent;
    cityInputEl.value = clickedCity;
    handleSearchFormSubmit(event);
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
searchHistorySectionEl.addEventListener("click", handleSearchHistoryClick);