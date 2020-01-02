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

  var currentTitleRow = $("<div class='title-row col-12'>")
  var currentTitle = $("<h4>").text("Current Weather Conditions");

  currentTitleRow.append(currentTitle);

  var currentConditions = $("<div class='currentConditions row'>");

  var currentCityImgCol = $("<div class='image col-6'>");

  dateString = moment.unix(response.dt).format("MM/DD/YYYY");
  var ccNameDate = $("<h6 class='nameDate'>").text(response.name + " " + dateString);

  var currentFig = $("<figure class='figure'>");

  var currentImage = $("<img class='img-weather'>");

  currentImage.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
  currentImage.attr("alt", response.weather[0].description);

  var currentFigCaption = $("<figcaption class='fig-caption'>").text(response.weather[0].description);

  currentFig.append(currentImage, currentFigCaption);

  currentCityImgCol.append(ccNameDate, currentFig);

  var currentDetails = $("<div class='details col-6'>");

  var currentTemp = $("<p class='currentTemp'>").text("Temp: " + response.main.temp + " F");
  var currentHum = $("<p class='currentHum'>").text("Humidity: " + response.main.humidity);
  var wind = $("<p class='wind'>").text("Windspeed: " + response.wind.speed);

  currentDetails.append(currentTemp, currentHum, wind)

  cityID = response.id;
  lat = response.coord.lat;
  long = response.coord.lon;

  currentConditions.append(currentCityImgCol, currentDetails);
  $(".currentWeatherDisplay").append(currentTitleRow, currentConditions);
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
        $(".currentWeatherDisplay .details").append(currentUVI);
  
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

      var forecastTitleRow = $("<div class='title-row col-12'>")

      var forecastTitle = $("<h4>").text("5-Day Forecast");

      forecastTitleRow.append(forecastTitle);
      $(".forecastDisplay").append(forecastTitleRow);

      for (i = 0; i<response.list.length; i++) {
        if (moment(response.list[i].dt, "X").format("H") == '13'){

          var forecastDay = $("<div class='fDay row'>");
          
          var forecastDayText = $("<h6>").text(moment(response.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format("dddd, MMMM Do"));

          var forecastFig = $("<figure class='figure'>");
          
          var forecastImage = $("<img class='img-weather'>");

          var forecastDateImgCol = $("<div class='image col-6'>");

          forecastImage.attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
          forecastImage.attr("alt", response.list[i].weather[0].description);

          var forecastFigCaption = $("<figcaption class='fig-caption'>").text(response.list[i].weather[0].description);

          forecastFig.append(forecastImage, forecastFigCaption);

          forecastDateImgCol.append(forecastDayText, forecastFig);

          var forecastDetails = $("<div class='details col-6'>");
          
          var forecastTemp = $("<p class='f-temp'>").text("Temp: " + response.list[i].main.temp + " F");

          var forecastHumid = $("<p class='f-humid'>").text("Humidity: " + response.list[i].main.humidity);

          forecastDetails.append(forecastTemp, forecastHumid)
          
          forecastDay.append(forecastDateImgCol, forecastDetails);

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

  var searchTitle = $("<p>").text("Search History");

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
