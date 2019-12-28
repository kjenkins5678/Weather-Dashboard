// Global Variables

var cities = [];
var APIKey = "d93007fc75acd09b861e4011b5d15c06";
var cityID = null;
var dateString = null;
var lat = null;
var long = null;
var curUVI = null;

function GetWeather(city){
  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
  "q=" + city + "&units=imperial&appid=" + APIKey;

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
    // console.log(queryURL);
    CurrentWeather(response);
    CurrentUVIndex(lat, long);
    Forecast(cityID);
  });
};


function CurrentWeather(response){
  $(".currentWeatherDisplay").empty();

  var currentTitle = $("<h3 class='card-title'>").text("Current Weather Conditions");
  var currentConditions = $("<div class='currentConditions'>");
  dateString = moment.unix(response.dt).format("MM/DD/YYYY");
  var ccNameDate = $("<p class='nameDate'>").text(response.name + " " + dateString);
  var currentTemp = $("<p class='currentTemp'>").text("Current Temperature: " + response.main.temp + " F");
  var currentHum = $("<p class='currentHum'>").text("Current Humidity: " + response.main.humidity);
  var wind = $("<p class='wind'>").text("Windspeed: " + response.wind.speed);

  cityID = response.id;
  lat = response.coord.lat;
  long = response.coord.lon;

  currentConditions.append(ccNameDate, currentTemp, currentHum, wind);
  $(".currentWeatherDisplay").append(currentTitle, currentConditions);
};

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

          var forecastTemp = $("<p class='f-temp'>").text("Temp: " + response.list[i].main.temp + " F");

          var forecastHumid = $("<p class='f-humid'>").text("Humidity: " + response.list[i].main.humidity);

          forecastDay.append(forecastDayText, forecastTemp, forecastHumid);

          $(".forecastDisplay").append(forecastDay);

        };

      };
      
    });

};

$("#search-btn").on("click", function() {

  event.preventDefault();

  $(".citySearches").empty();
  city = $("#cityInput").val();
  cities.push(city);

  var searchTitle = $("<h5 class='card-title'>").text("Search History");

  var searchedListSpace = $("<div class='searched-container'>");
  $(".citySearches").append(searchTitle, searchedListSpace);

  for (i = 0; i < cities.length; i++){
    var historyBtn = $("<button type='button' class='btn btn-link'>");
    historyBtn.attr("data-id", i);
    historyBtn.text(cities[i]);
    $(".searched-container").prepend(historyBtn);
  };

  GetWeather(city);

});

$(".citySearches").on("click", ".btn-link", function() {

  console.log(cities[$(this).attr("data-id")]);

  GetWeather(cities[$(this).attr("data-id")]);

});
