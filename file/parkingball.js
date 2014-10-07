
//setup variables
var dirDisplay, map, dirService = new google.maps.DirectionsService();

//initialize the map
function initialize() {
    //call new DirectionsRenderer
    dirDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {
      center: { lat: 39.9833, lng:-82.9833},
      zoom: 5
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

    dirDisplay.setMap(map);

    //prompt user input for start and end locations
    // start = prompt("Enter a start address:");
    // end = prompt("Enter a destination address:");

    // //set geoCode starting location
    // geoCode(start);

    //log resulta
    // console.log(result);

    //calculate route
    // calcRoute();

  }
  // google.maps.event.addDomListener(window, 'load', initialize);

  function geoCode(start){
    var ret;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address' : start},function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        var address = results[0].geometry.location;
        map.setCenter(address);
        var marker = new google.maps.Marker({
          map: map,
          position: address
        });

      }else{
        alert("Could not find that start address for the following reason: "+status);
      }
    });
  }


  function calcRoute(){

    //get route info
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;


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

  }

  window.addEventListener('load', function(){

    initialize();

  });
