let APIKey = "30be1111837fac08219d0c856c8d8a6d";
let searchFormEl = document.getElementById("search-form");
let cityInputEl = document.getElementById("city-input");
let cityNameEl = document.getElementById("city-name");
let dateEl = document.getElementById("date");
let weatherIconEl = document.getElementById("weather-icon");
let temperatureEl = document.getElementById("temperature");
let windSpeedEl = document.getElementById("wind-speed");
let humidityEl = document.getElementById("humidity");
let errorMessageEl = document.getElementById("error-message");
let currentWeatherEl = document.getElementById("current-weather");
let forecastSectionEl = document.getElementById("forecast-section");
let forecastContainerEl = document.getElementById("forecast-container");
let searchHistorySectionEl = document.getElementById("search-history-section");
let searchHistoryListEl = document.getElementById("search-history-list");

let searchHistory = [];
loadSearchHistory();

function handleSearchFormSubmit(event) {
    event.preventDefault();

    let city = cityInputEl.value.trim();

    if(!city){
        errorMessageEl.textContent = "Enter a city name!";
        return;
    }

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

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

            let iconCode = data.weather[0].icon;
            let iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"
            weatherIconEl.src = iconURL;

            let currentDate = new Date();
            dateEl.textContent = "Date: " + currentDate.toLocaleDateString();

            let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;

            fetch(forecastURL)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Error: " + response.status);
                    }
                })
                .then (function (forecastData) {
                    forecastContainerEl.innerHTML = "";
                    console.log(forecastData);
                    for (let i = 0; i < forecastData.list.length; i += 8) {
                        let forecastItem = forecastData.list[i];
                        let forecastDate = new Date(forecastItem.dt * 1000);
                        let forecastIconCode = forecastItem.weather[0].icon;
                        let forecastIconURL = "http://openweathermap.org/img/wn/" + forecastIconCode + ".png";
                        let forecastTemperature = forecastItem.main.temp;
                        let forecastWindSpeed = forecastItem.wind.speed;
                        let forecastHumidity = forecastItem.main.humidity;
            
                        let forecastCardEl = document.createElement("div");
                        forecastCardEl.classList.add("forecast-card");
            
                        let forecastDateEl = document.createElement("p");
                        forecastDateEl.textContent = forecastDate.toLocaleDateString();
                        forecastDateEl.style.fontWeight = "bold";
                        forecastCardEl.appendChild(forecastDateEl);
            
                        let forecastIconEl = document.createElement("img");
                        forecastIconEl.src = forecastIconURL;
                        forecastIconEl.alt = "Forecast Weather Icon";
                        forecastCardEl.appendChild(forecastIconEl);
            
                        let forecastTemperatureEl = document.createElement("p");
                        forecastTemperatureEl.textContent = "Temperature: " + forecastTemperature + "°F";
                        forecastCardEl.appendChild(forecastTemperatureEl);
            
                        let forecastWindSpeedEl = document.createElement("p");
                        forecastWindSpeedEl.textContent = "Wind Speed: " + forecastWindSpeed + " mph";
                        forecastCardEl.appendChild(forecastWindSpeedEl);
            
                        let forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.textContent = "Humidity: " + forecastHumidity + "%";
                        forecastCardEl.appendChild(forecastHumidityEl);
            
                        forecastContainerEl.appendChild(forecastCardEl);    
                    }
                })
                .catch(function (error) {
                    errorMessageEl.textContent = "An error occurred: " + error.message;
                });

           addToSearchHistory(data.name);
        })
        .catch(function (error) {
            errorMessageEl.textContent = "An error occurred: " + error.message;
        });

    currentWeatherEl.classList.remove("hidden");
    forecastSectionEl.classList.remove("hidden");
    searchHistorySectionEl.classList.remove("hidden");
    searchHistorySectionEl.style.display = "flex";

    addToSearchHistory(city);
}

function addToSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        let liEl = document.createElement("li");
        liEl.textContent = city;
        searchHistoryListEl.appendChild(liEl);

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
}

function loadSearchHistory() {
    let storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
        searchHistory = JSON.parse(storedSearchHistory);

        searchHistory.forEach(function (city) {
            let liEl = document.createElement("li");
            liEl.textContent = city;
            searchHistoryListEl.appendChild(liEl);
        });
    }
}

function handleSearchHistoryClick(event) {
    let clickedCity = event.target.textContent;
    cityInputEl.value = clickedCity;
    handleSearchFormSubmit(event);
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);
searchHistorySectionEl.addEventListener("click", handleSearchHistoryClick);