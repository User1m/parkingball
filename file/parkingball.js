
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
    //get trip time
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

    // console.log(timeOfDay);

    //get parking availability data
    // console.log([destination, timeOfDay]);
    if(destination && timeOfDay){

      //get Data from apis
      getData(destination, timeOfDay);

    }else{
      alert("You forgot to fill something out!");
      // location.reload();
    }

  }


  /*
  * Function to retrieve data
  */

  function getData(dest, time){

    var url = "http://api.parkwhiz.com/search/?destination="+dest+"&key=12189e4e3e18fd94d513a6c77f5fd621";

    // console.log(url);

    $.ajax({
      url: url,
      type: "GET",
      crossDomain: true, // enable this
      dataType: 'jsonp',
      success: function(data){ predictParking(data, time); }, //closure function - can pass param in deeper
      error: function() { console.log('get Data Failed!'); }
    });

  }

  /*
  * Method predicts the availability of parking around a destinaion
  */
  function predictParking(data, time){

    var result;

    // console.dir(result);
    var parkingCount = data['parking_listings'];

    //check the number of parking locations in the area
    if(parkingCount == undefined){
      parkingCount = data['locations'];
    }else{
      parkingCount = data['parking_listings'].length;
    }

    // console.log(parkingCount);

    //determine value based on # of parking locations
    if(parkingCount == 0){
      result = 0.05;

    }else if(parkingCount >= 1 && parkingCount <= 10){
      result = 0.05;

    }else if(parkingCount >= 11 && parkingCount <= 20){
      result = 0.05;

    }else{
      result = 0.05;

    }

    // console.log("time: "+time);

    // var timeOfDay = getTOD();

    //factor in vaiables
    var deNom = 0.25;

    var wD = factorInWeekDay();
    // console.log("weekday result: "+wD);

    var ToD = factorInToD(time);
    // console.log("hour result: "+ToD);

    var season = factorInSeason();
    // console.log("season result: "+season);

    // console.log("destination result: "+result);

    //calculate score
    var totalScore = (wD/deNom) + (ToD/deNom) + (season/deNom) + (result/deNom);

    console.log(totalScore);


    if(!isNaN(totalScore)){

      // output string to be combined with a predictoin string
      var output = "From what I can tell...";

      if(totalScore >= 0 && totalScore <= 0.5){

        console.log(output + "IT's VERY UNLIKELY You'll Have Parking!");

        var altRoutes = confirm("Would you like me to pull up a map for other alternative forms of transportation that don't require parking? ");

        if(altRoutes){
          console.log("Pull up routes");
        }else{
          console.log("Do not pull up routes");
        }
      }else if(totalScore >= 0.6 && totalScore <= 0.8){
       console.log(output + "It's Very Likely You'll Have Parking!");
     }else{
      console.log(output + "There'll be Parking! Good Job");
    }
  }else{
    console.log("Something went wrong in the score calculation");
  }
}


  /*
  * Method to get the current day
  */

  function getTheDate(){
    var day = new Date();
    // console.log(day);
    return day;
  }


  function factorInWeekDay(){

    var result;
    //get the Date
    var date = getTheDate();
    //get the day of the week
    var weekDay = date.getDay();

    //determine value based on current weekday
    switch( weekDay ){
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      result = 0.042;
      break;

      case 5:
      case 6:
      result = 0.042;
      break;
    }

    return result;
  }

  function factorInToD(hour){

    var result;

    hour = Number(hour);

    // console.log("facorInToD: "+hour);

    if(!isNaN(hour) || hour != undefined){

      if(hour >= 0 && hour <= 5){
        result = 0.01042;

      }else if(hour >= 6 && hour <= 11){
        result = 0.01042;

      }else if(hour >= 12 && hour <= 15){
        result = 0.01042;

      }else if(hour >= 16 && hour <= 20){
        result = 0.01042;

      }else{
        result = 0.01042;

      }
    }

    // console.log("facorInToD result: "+result);

    return result;

  }


  function factorInSeason(){

    var season, result;

    //get date
    var date = getTheDate();

    //get the month
    var month = date.getMonth();

    //determine season and value based on season
    switch(month){
      case 0: //december
      case 1:
      case 2:
      season = "winter";
      result = 0.0625;
      break;

      case 3:
      case 4:
      case 5:
      season ="spring";
      result = 0.0625;
      break;

      case 6:
      case 7:
      case 8:
      season ="summer";
      result = 0.0625;
      break;

      case 9:
      case 10:
      case 11:  //november
      season ="fall";
      result = 0.0625;
      break;
    }

    // console.log(season);
    return result;

  }

  window.addEventListener('load', function(){

    initialize();

  });
