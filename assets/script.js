// Global Variables

var cities = [];
var APIKey = "d93007fc75acd09b861e4011b5d15c06";
var cityID = null;
var dateString = null;
var lat = null;
var long = null;
var curUVI = null;
var stored = JSON.parse(localStorage.getItem("cities"));

if (stored !== null) {
  var lastSearched = stored[stored.length - 1]
  console.log(lastSearched);
  GetWeather(lastSearched);
  SearchHistory(stored);
  cities = cities.concat(stored);
}

/* ------ GetWeather ------
Set the query URL string
Run AJAX call
Run CurrentWeather, CurrentUVIndex, Forecast with AJAX response
*/
function GetWeather(city){
  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
  "q=" + city + "&units=imperial&appid=" + APIKey;

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
    CurrentWeather(response);
    CurrentUVIndex(lat, long);
    Forecast(cityID);
  });
};

/* ------ CurrentWeather ------
Clear Weather Display
Create & Append Current Weather HTML
*/
function CurrentWeather(response){
  $(".currentWeatherDisplay").empty();

  var currentTitle = $("<h3 class='card-title'>").text("Current Weather Conditions");
  var currentConditions = $("<div class='card currentConditions col-12'>");
  dateString = moment.unix(response.dt).format("MM/DD/YYYY");
  var ccNameDate = $("<h5 class='nameDate card-title'>").text(response.name + " " + dateString);
  var currentImage = $("<img class='img-weather'>");

  currentImage.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
  currentImage.attr("alt", response.weather[0].description);
  var currentTemp = $("<p class='currentTemp'>").text("Temp: " + response.main.temp + " F");
  var currentHum = $("<p class='currentHum'>").text("Humidity: " + response.main.humidity);
  var wind = $("<p class='wind'>").text("Windspeed: " + response.wind.speed);

  cityID = response.id;
  lat = response.coord.lat;
  long = response.coord.lon;

  currentConditions.append(ccNameDate, currentImage, currentTemp, currentHum, wind);
  $(".currentWeatherDisplay").append(currentTitle, currentConditions);
};

/* ------ CurrentUVIndex ------
Create UVI API query URL
Run AJAX call
Create & Append UVI HTML
*/
function CurrentUVIndex(lat, long){
  queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey + "&lat="+ lat +"&lon=" + long;
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
  
        // Log the queryURL
        curUVI = response.value;
        var currentUVI = $("<p class='currentUV'>").text("UV Index: " + curUVI);
        $(".currentWeatherDisplay .currentConditions").append(currentUVI);
  
      });
};

/* ------ Forecast ------
Create Forecast API query URL
Run AJAX call
Create & Append Forecast HTML
Loop through API response list
If forecast time is 1300
Create & Append Forecast Details HTML
*/
function Forecast(cityID){
  queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=" + APIKey;
  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

      $(".forecastDisplay").empty();

      var forecastTitle = $("<h3 class='card-title'>").text("5-Day Forecast");
      $(".forecastDisplay").append(forecastTitle);

      for (i = 0; i<response.list.length; i++) {
        if (moment(response.list[i].dt, "X").format("H") == '13'){

          var forecastDay = $("<div class='card fDay col-12'>");
          
          var forecastDayText = $("<h5 class='card-title'>").text(moment(response.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format("dddd, MMMM Do"));

          var forecastImage = $("<img class='img-weather'>");

          forecastImage.attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
          forecastImage.attr("alt", response.list[i].weather[0].description);
          
          var forecastTemp = $("<p class='f-temp'>").text("Temp: " + response.list[i].main.temp + " F");

          var forecastHumid = $("<p class='f-humid'>").text("Humidity: " + response.list[i].main.humidity);

          forecastDay.append(forecastDayText, forecastImage, forecastTemp, forecastHumid);

          $(".forecastDisplay").append(forecastDay);

        };

      };
      
    });

};

/* ------ SearchButtonClickEvent -----
Empty .citySearches
Get value in text box
Push value to cities list
Create & Append search history HTML
Create searched city buttons from cities list
Call GetWeather function
*/

function SearchHistory(cities){

  var searchTitle = $("<h6>").text("Search History");

  var searchedListSpace = $("<div class='searched-container'>");

  $(".citySearches").append(searchTitle, searchedListSpace);

  for (i = 0; i < cities.length; i++){
    var historyBtn = $("<button type='button' class='btn btn-link'>");
    historyBtn.attr("data-id", i);
    historyBtn.text(cities[i]);
    $(".searched-container").prepend(historyBtn);
  };
};

$("#search-btn").on("click", function() {

  event.preventDefault();

  $(".citySearches").empty();
  city = $("#cityInput").val();
  cities.push(city);

  localStorage.removeItem("cities");
  localStorage.setItem("cities", JSON.stringify(cities));

  SearchHistory(cities);

  GetWeather(city);

});

/* ------ CityButtonsClickEvent -----
Call GetWeather Function for with data-id of clicked button
*/

$(".citySearches").on("click", ".btn-link", function() {
  console.log(cities);

  GetWeather(cities[$(this).attr("data-id")]);

});
