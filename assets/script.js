var cities = [];

function CurrentWeather(response){
  var currentConditions = $("<div class='currentConditions'>");
  var dateString = moment.unix(response.dt).format("MM/DD/YYYY");
  var ccNameDate = $("<p class='nameDate'>").text(response.name + " " + dateString);
  var currentTemp = $("<p class='currentTemp'>").text("Current Temperature: " + response.main.temp + " F");
  var currentHum = $("<p class='currentHum'>").text("Current Humidity: " + response.main.humidity);
  var wind = $("<p class='wind'>").text("Windspeed: " + response.wind.speed);

  currentConditions.append(ccNameDate, currentTemp, currentHum, wind);
  $(".currentWeatherDisplay").append(currentConditions);
};

$(".btn").on("click", function() {

  event.preventDefault();
  city = $("#cityInput").val();
  cities.push(city);
  console.log(cities);

  $(".citySearches").append($("<div class='searched'>").text(city));

  var APIKey = "d93007fc75acd09b861e4011b5d15c06";

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

    });

});
