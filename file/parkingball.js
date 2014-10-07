
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
    var time = document.getElementById('time').value;

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
    // console.log(hour);
    var weekDay = getDay()
    //get parking availability data
    console.log([destination, timeOfDay]);

    if(destination && timeOfDay){

      //get Data from apis
      getData(destination);

    }else{
      alert("You forgot to fill something out!");
      // location.reload();
    }

  }


  /*
  * Function to retrieve data
  */

  function getData(dest){

    $.ajax({
      url: "http://api.parkwhiz.com/search/?destination="+dest+"&key=12189e4e3e18fd94d513a6c77f5fd621",
      type: "GET",
      crossDomain: true, // enable this
      dataType: 'jsonp',
      success: predictParking,
      error: function() { console.log('get Data Failed!'); }
    });

  }

  /*
  * Method predicts the availability of parking around a destinaion
  */
  function predictParking(result){
    // console.dir(result);
    var parkingCount = result['parking_listings'];

    if(parkingCount == undefined){
      parkingCount = result['locations'];
    }else{
      parkingCount = result['parking_listings'].length;
    }

    console.log(parkingCount);

    // // output string to be combined with a predictoin string
    // var output = "From what I can tell...";

    //switch statement to reveal results
    switch(parkingCount){
      case 0:
      alert("Very Likely You'll Have Parking! Good Job");
      break;

      case 1:
      alert("VERY UNLIKELY You'll Have Parking!");
      var altRoutes = confirm("Would you like me to pull up a map for other alternative forms of transportation that don't require parking? ");

      if(altRoutes){
        console.log("Pull up routes");
      }else{
        console.log("Do not pull up routes");
      }

      break;

      case 5:
      alert("Very Little Chance You'll Have Parking!");
      break;

      case 10:
      alert("You Are Somewhat Likely You'll Have Parking!");
      break;

      case 15:
      alert("Very Likely You'll Have Parking!");
      break;

      default:
      alert("I'm sorry, something went horribly wrong. Please retry!");
      break;
    }

  }


  /*
  * Method to get the current day
  */

  function getDay(){
    var d = new Date();
    var day = d.getDay();
    // console.log(day);
    return day;
  }



  window.addEventListener('load', function(){

    initialize();

  });
