
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

  /*
  * Method geocodes an address and returns it
  */

  function geoCode(start){
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
  }

  /*
  * Method calcualtes a route from start to destinaion
  */

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


  /*
  * Function to retrieve data
  */

  function getData(dest){

    $.ajax({
      url: "http://api.parkwhiz.com/search/?destination="+dest+"&key=12189e4e3e18fd94d513a6c77f5fd621",
      type: "GET",
      dataType : "json",
      success : predictParking,
      failure : function(){
        console.log("getData failed!");
      }
    });

  }

  /*
  * Method predicts the availability of parking around a destinaion
  */
  function predictParking(result){



  }



  window.addEventListener('load', function(){

    initialize();

  });
