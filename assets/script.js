var cities = [];
var APIKey = "d93007fc75acd09b861e4011b5d15c06";
var cityID = null;
dateString = null;


function CurrentWeather(response){
  $(".currentWeatherDisplay").empty();
  var currentConditions = $("<div class='currentConditions'>");
  dateString = moment.unix(response.dt).format("MM/DD/YYYY");
  var ccNameDate = $("<p class='nameDate'>").text(response.name + " " + dateString);
  var currentTemp = $("<p class='currentTemp'>").text("Current Temperature: " + response.main.temp + " F");
  var currentHum = $("<p class='currentHum'>").text("Current Humidity: " + response.main.humidity);
  var wind = $("<p class='wind'>").text("Windspeed: " + response.wind.speed);

  cityID = response.id;

  currentConditions.append(ccNameDate, currentTemp, currentHum, wind);
  $(".currentWeatherDisplay").append(currentConditions);
};

function UVindex(lat, long, count){
  queryURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid="+ APIKey + "&lat="+ lat +"&lon=" + long;
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
  
        // Log the queryURL
        console.log(response[0]);
  
      });

      // UVindex(response.coord.lat, response.coord.lon, 1);


};

function Forecast(cityID){
  queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

      // Log the queryURL
      console.log("starting date: " + dateString);
      //https://stackoverflow.com/questions/16808911/momentjs-how-do-i-build-moment-from-date-and-time-string

      // var newDate = dateString.add(1, 'd'); // This doesn't work. can do moment method on non-moment object
      var newDate = moment(dateString, "MM-DD-YYYY");
      console.log(newDate);
      // console.log(response);
      
      $(".forecastDisplay").empty();

      

    });

};


$(".btn").on("click", function() {

  event.preventDefault();
  city = $("#cityInput").val();
  cities.push(city);
  console.log(cities);

  $(".citySearches").append($("<div class='searched'>").text(city));

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
      Forecast(cityID);
    });



});
