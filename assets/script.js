var cities = [];
var APIKey = "d93007fc75acd09b861e4011b5d15c06";
var cityID = null;
var dateString = null;
var lat = null;
var long = null;
var curUVI = null;


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

      // console.log(dateString + " 13");
      // var newDate = moment(dateString + " 13", "MM/DD/YYYY H");
      // var forcastDay1 = newDate.add(1, 'd');
      // var forcast1TimeStamp = forcastDay1.format("MM/DD/YYYY H");
      // console.log(forcast1TimeStamp);

      var forecastTitle = $("<h3 class='card-title'>").text("5-Day Forecast");
      $(".forecastDisplay").append(forecastTitle);



      for (i = 0; i<response.list.length; i++) {
        if (moment(response.list[i].dt, "X").format("H") == '13'){
          // console.log(moment(response.list[i].dt, "X").format());
          // console.log(response.list[i].dt_txt);

          var forecastDay = $("<div class='card fDay col-12'>").text(moment(response.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format("dddd Do"));

          var forecastTemp = $("<div class='f card-body'>").text("Temp: " + response.list[i].main.temp + " F");

          forecastDay.append(forecastTemp);

          $(".forecastDisplay").append(forecastDay);

        };

      };
      
    });

};

$(".btn").on("click", function() {

  event.preventDefault();

  $(".citySearches").empty();
  city = $("#cityInput").val();
  cities.push(city);

  console.log(cities)


  var searchTitle = $("<h5 class='card-title'>").text("Search History");

  var searchedListSpace = $("<div class='searched-container'>");
  $(".citySearches").append(searchTitle, searchedListSpace);

  for (i = 0; i < cities.length; i++){
    $(".searched-container").prepend($("<div class='searched'>").text(cities[i]));
  };


  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q=" + city + "&units=imperial&appid=" + APIKey;

  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

      // Log the queryURL
      console.log(queryURL);

      CurrentWeather(response);
      CurrentUVIndex(lat, long);
      Forecast(cityID);
    });

});
