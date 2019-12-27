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

      for (i = 0; i<response.list.length; i++) {
        if (moment(response.list[i].dt, "X").format("H") == '13'){
          // console.log(moment(response.list[i].dt, "X").format());
          // console.log(response.list[i].dt_txt);
          var forecastDay = $("<div class='fDay row'>").text(moment(response.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format("dddd Do"));

          var forecastTemp = $("<div class='f'>").text("Temp: " + response.list[i].main.temp + " F");

          forecastDay.append(forecastTemp);

          $(".forecastDisplay").append(forecastDay);





        };

      };
      
      

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
