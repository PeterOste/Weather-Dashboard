var APIKey = "30be1111837fac08219d0c856c8d8a6d";
var searchFormEl = document.getElementById("search-form");
var cityInputEl = document.getElementById("city-input");
var cityNameEl = document.getElementById("city-name");
// var dateEl = document.getElementById("date");
var weatherIconEl = document.getElementById("weather-icon");
var temperatureEl = document.getElementById("temperature");
var windSpeedEl = document.getElementById("wind-speed");
var humidityEl = document.getElementById("humidity");
var errorMessageEl = document.getElementById("error-message");
var currentWeatherEl = document.getElementById("current-weather");
var forecastSectionEl = document.getElementById("forecast-section");
var searchHistorySectionEl = document.getElementById("search-history-section");

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if(!city){
        errorMessageEl.textContent = "Enter a city name";
        return;
    }

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error: " + response.status);
            }    
        })
        .then(function (data) {
            // Process retrieved weather data
            // console.log(data);

            cityNameEl.textContent = data.name;
            temperatureEl.textContent = "Temperature: " + data.main.temp + "°C";
            windSpeedEl.textContent = "Wind Speed: " + data.wind.speed + " m/s";
            humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
            errorMessageEl.textContent = "";

            var iconCode = data.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"
            weatherIconEl.src = iconURL;
        })
        .catch(function (error) {
            errorMessageEl.textContent = "An error occurred: " + error.message;
        });
    currentWeatherEl.classList.remove("hidden");
    forecastSectionEl.classList.remove("hidden");
    searchHistorySectionEl.classList.remove("hidden");

}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
