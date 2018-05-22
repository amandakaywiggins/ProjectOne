var config = {
    apiKey: "AIzaSyCoskBfAja3rGiTEvs6dQLu1hwhg3uNss8",
    authDomain: "supercooldash-96c39.firebaseapp.com",
    databaseURL: "https://supercooldash-96c39.firebaseio.com",
    projectId: "supercooldash-96c39",
    storageBucket: "supercooldash-96c39.appspot.com",
    messagingSenderId: "723123196340"
};

firebase.initializeApp(config);

var database = firebase.database();

var userName = "";
var userZip = "";
var userBirthday = "";

$("#submit").on("click", function(event){
    event.preventDefault();
    userName = $("#name-input").val().trim();
    userZip = $("#zipcode-input").val().trim();
    userBirthday = $("#birthday-input").val().trim();
    
    database.ref().push({
        userName: userName,
        userZip: userZip,
        userBirthday: userBirthday
    });

    window.location.href ="dashboard.html";
});


//TODO FIX
function zomato(){
    var url = "https://developers.zomato.com/api/v2.1/geocode?lat=" + pos.lat + "&lon=" + pos.lng
    console.log(url)
}

function buildStories() {
    var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
    
    url += '?' + $.param({
        'api-key': "b9f91d369ff59547cd47b931d8cbc56b:0:74623931"
    });
    
    //ajax call
    $.ajax({
        url: url,
        method: 'GET',
    }).then(function(response){
        var results = response.results;
        console.log(results);
        var s = '';
        results.length = 5;
            for(r of results) {
                console.log(r.title)
                //creates a string with the elements pulled from the api, turns it into readable html/text
                s = s+`<div class="nyt-section">${r.section}
                <div class="nyt-title">${r.title}</div> 
                <div class="nyt-abstract">${r.abstract}</div>
                <div class="nyt-byline">${r.byline}</div>
                <div class="nyt-link"><a href='${r.short_url}'>Go To Article</a><p></div></div>`
            };
        $("#nyt-articles").html(s);
    });
};
    
buildStories();

var map, infoWindow;
var pos;          
function initMap() {
    map = new google.maps.Map(document.getElementById("map-display"), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12
    });
        
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
            
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            declarePOS(pos);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    };
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};

//weatherAPI

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var point = new google.maps.LatLng(lat, long);
        new google.maps.Geocoder().geocode(
            {'latLng': point},

            function (res, status) {

                var APIKey = "0cdaef666666e73cec0a1f220c106a82";
                var queryURL;
                var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIKey;
                
                console.log(queryURL);
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) {

                    console.log(response);
                    // Transfer content to HTML
                    var wind = response.wind.speed;
                    var humidity = response.main.humidity;
                    var temp = response.main.temp;
                    var weatherDisplay = $("<div>");
                    weatherDisplay.append($("<div>Wind Speed: " + wind + "</div><div> Humidity: " + humidity + "</div><div>Temperature: " + temp + "</div>"));
                    $("#weather-display").append(weatherDisplay);
                    // Log the data in the console as well
                    console.log("Wind Speed: " + response.wind.speed);
                    console.log("Humidity: " + response.main.humidity);
                    console.log("Temperature (F): " + response.main.temp);
                    console.log("Rain" +  response.list.rain);
                });
            });
        }
    );
};
function declarePOS(expectedPOS) {
    console.log(expectedPOS)
}