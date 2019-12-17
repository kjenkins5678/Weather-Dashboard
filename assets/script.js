// This is our API key
var APIKey = "d93007fc75acd09b861e4011b5d15c06";
var city = "District of Columbia"

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

    // Log the resulting object
    console.log(response);

  });