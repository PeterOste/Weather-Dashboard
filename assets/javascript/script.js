var APIKey = "30be1111837fac08219d0c856c8d8a6d";
var country;
var state;
var city;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API key;

fetch(queryURL)
// Adjust application to accept user input.
