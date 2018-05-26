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
var userFavAnimal = "";
var userBirthday = "";

$("#submit").on("click", function(event){
    event.preventDefault();
    userName = $("#name-input").val().trim();
    userFavAnimal = $("#fav-animal-input").val().trim();
    userBirthday = $("#birthday-input").val().trim();
    
    database.ref().push({
        userName: userName,
        userFavAnimal: userFavAnimal,
        userBirthday: userBirthday
    });
    localStorage.clear();
    localStorage.setItem("localName" , userName);

    window.location.href ="dashboard.html";
});

console.log(localStorage.getItem("localName"));
var localUser = localStorage.getItem("localName");

function welcome() {
    $("#user-name").text(localUser);
};

welcome();

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
                //TODO section div should not encompass everything
                //creates a string with the elements pulled from the api, turns it into readable html/text
                s = s +`<div class="nyt-section">${r.section}
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
            
            $.ajax({
                url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + pos.lat + "&lon=" + pos.lng,
                method: 'GET',
                headers: {
                    "user-key": "2457ece772ffe351c5664115a2e148c7" 
                }
            }).then(function(response){
                console.log(response)
                var places = response.nearby_restaurants.slice(0,5);
                console.log(places);
                var placesHTML = '';
                for (p of places){
                    placesHTML = placesHTML + `<p>${p.restaurant.name}
                    <br>
                    ${p.restaurant.location.address}
                    <br>
                    <a href="${p.restaurant.menu_url}">Menu</a></p>`
                }
                
                $("#restaurants").html(placesHTML)
                console.log(p.restaurant.menu_url)
            })

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

if (navigator.geolocation) {
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
                    var weatherDisplay = $("<div id='weather-info'>");
                    weatherDisplay.append($("<div>Wind Speed: " + wind + "</div><div> Humidity: " + humidity + "</div><div>Temperature: " + temp + "</div>"));
                    $("#weather-display").append(weatherDisplay);
                    // Log the data in the console as well
                    console.log("Wind Speed: " + response.wind.speed);
                    console.log("Humidity: " + response.main.humidity);
                    console.log("Temperature (F): " + response.main.temp);
                    var weatherCode = response.weather[0].id
                    console.log(weatherCode);
                        if (weatherCode === 200 || weatherCode === 230 || weatherCode === 231 || weatherCode === 300 || weatherCode === 301
                             || weatherCode === 310 || weatherCode === 313 || weatherCode === 321 || weatherCode === 500 
                             || weatherCode === 520) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/light_rain.jpg)"); 
                        } else if (weatherCode === 210 || weatherCode === 302 || weatherCode === 311 || weatherCode === 501 
                            || weatherCode === 522 || weatherCode === 531) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/rain.jpg)");                             
                        } else if (weatherCode === 312 || weatherCode === 313 || weatherCode === 314 || weatherCode === 503 
                            || weatherCode === 502) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/heavy_rain.jpg)");                             
                        } else if (weatherCode === 202 || weatherCode === 211 || weatherCode === 212 || weatherCode === 221 
                            || weatherCode === 232 || weatherCode === 711) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/thunderstorm.jpg)"); 
                        } else if (weatherCode === 504) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/extreme_rain.jpg)");                             
                        } else if (weatherCode === 600 || weatherCode === 615) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/light_snow.jpg)");                             
                        } else if (weatherCode === 601 || weatherCode === 616 || weatherCode === 621) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/snow.jpg)");                             
                        } else if (weatherCode === 602 || weatherCode === 622) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/heavy_snow.jpg)");                             
                        } else if (weatherCode === 611 || weatherCode === 612 || weatherCode === 511) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/sleet.jpg)");                             
                        } else if (weatherCode === 701 || weatherCode === 741) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/fog.jpg)");                             
                        } else if (weatherCode === 711) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/smoke.jpg)");                             
                        } else if (weatherCode === 721) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/haze.jpg)");                             
                        } else if (weatherCode === 731 || weatherCode === 751 || weatherCode === 761) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/dust.jpg)");                             
                        } else if (weatherCode === 762) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/volcanic_ash.jpg)");                             
                        } else if (weatherCode === 781) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/tornado.jpg)");                             
                        } else if (weatherCode === 800) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/clear.jpg)");  
                        } else if (weatherCode === 801 || weatherCode === 802) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/scattered_clouds.jpg)");                             
                        } else if (weatherCode === 803 || weatherCode === 804) {
                            $("#weather-div").css("background-image", "url(assets/images/weather/overcast.jpg)");                             
                        } else {
                            $("#weather-div").css("background-image", "url(assets/images/weather/earth.jpg)");                             
                        };
                });    
            });
        }
    );
};

//GIPHY API
function displayCuteAnimals() {
    database.ref().orderByChild("userName").equalTo(localUser).on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());
        animal = childSnapshot.val().userFavAnimal;
        console.log(animal);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + animal + "&api_key=dc6zaTOxFJmzC&limit=1";
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var results = response.data;
            
            for (var i = 0; i < results.length; i++) {
                var animalDiv = $("<div>");
                animalDiv.addClass("image-style");
                var animalImage = $("<img>");
                var imageURL = results[i].images.fixed_height.url
                var stillImageURL = results[i].images.fixed_height_still.url;
                animalImage.attr("src", stillImageURL);
                animalImage.attr("data-still" , stillImageURL);
                animalImage.attr("data-animate" , imageURL);
                animalImage.attr("data-state" , "still");
                animalImage.addClass("animateThatBitch");
                animalDiv.append(animalImage);
                $("#cute-animals").append(animalDiv);
            }
        });
    });
};

displayCuteAnimals();

$(document).on("click" , "img.animateThatBitch" , function() {
    console.log(this)
    var state = $(this).attr("data-state");

    if (state === "still") {
        $(this).attr("src" , $(this).attr("data-animate"));
        $(this).attr("data-state" , "animate");
    } else {
        $(this).attr("src" , $(this).attr("data-still"));
        $(this).attr("data-state" , "still");
    }
}); 
