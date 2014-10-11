
//setup variables
var dirDisplay, map, dirService = new google.maps.DirectionsService();
//set class variables
var start, end, time;

var app = {

//initialize the map
initialize: function() {
    //call new DirectionsRenderer
    dirDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {
      center: { lat: 39.9833, lng:-82.9833},
      zoom: 5
    };
    map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);

    dirDisplay.setMap(map);
    dirDisplay.setPanel(document.getElementById("directions_area"));

  },

  /*
  * Method geocodes an address and returns it
  */

  geoCode: function(start){
    var address;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address' : start},function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        address = results[0].geometry.location;
        map.setCenter(address);
        var marker = new google.maps.Marker({
          map: map,
          position: address
        });

        return address;

      }else{
        alert("Could not find that start address for the following reason: "+status);
      }
    });
  },

  /*
  * Method calcualtes a route from start to destinaion
  */

  calcRoute: function(){

    // console.log("onclick happend");

    //get route info
    start = document.getElementById('start').value;
    end = document.getElementById('end').value;
    //get trip time
    time = document.getElementById('time').value;

      //form request
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      //make service request for route
      dirService.route(request, function(result, status){
      //if ok the show route
      if(status == google.maps.DirectionsStatus.OK){
        dirDisplay.setDirections(result);
      }
    });

    //variables that are taken into account in algorithm
    //html escape the destination address
    var destination = escape(end);

    var timeOfDay = time.split(":")[0];

    // console.log(timeOfDay);

    //get parking availability data
    // console.log([destination, timeOfDay]);
    if(destination && timeOfDay){

      //get Data from apis
      core.getData(destination, timeOfDay, "app");

    }else{
      alert("You forgot to fill something out!");
      // location.reload();
    }

  },

 /*
  * Brings up alternate transit info if user requests
  */
  altRoute: function(response){

    if(response == "y"){
    //make request
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.TRANSIT
    };

    dirService.route(request, function(response, stat){
      if(stat == google.maps.DirectionsStatus.OK){
        dirDisplay.setDirections(response);
        dirDisplay.setPanel(document.getElementById("directions_area"));
      }
    });
    document.getElementById("result_area").innerHTML="<div class=\"alert alert-info\" role=\"alert\"><strong>Here is a route to "+end+" using transit. It's a much greener option and certainly doesn't require parking!</strong></div>";
    return false;
  }else{
    document.getElementById("result_area").innerHTML="<div class=\"alert alert-info\" role=\"alert\"><strong>Well then I would recommend visiting "+end+" on a weekend evening when there's a higher likelihood that you'll have parking!</strong></div>";
    return false;
  }
}

};


// window.onload = parkingBall.initialize();
window.addEventListener('load', function(){
  app.initialize();
  document.getElementById('submit').addEventListener('click', app.calcRoute);

});
