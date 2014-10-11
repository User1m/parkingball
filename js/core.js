/*
* Class containing the core prediction functionality.
*/

var core = {

  /*
  * Method to get the current day
  */

  getTheDate: function(){
    var day = new Date();
    // console.log(day);
    return day;
  },



  factorInSeason: function(){

    var season, result;

    //get date
    var date = this.getTheDate();

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
  },


  factorInWeekDay: function(){

    var result;
    //get the Date
    var date = this.getTheDate();
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
  },

  factorInToD: function(hour){

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

  },


  buildOutput: function (status){

  // output string to be combined with a predictoin string
  var output ="<div class=\"alert "+status+" alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>From what I can tell...";

  return output;
},


  /*
  * Function to retrieve data
  */

  getData: function (dest, time){

    var url = "https://api.parkwhiz.com/search/?destination="+dest+"&key=12189e4e3e18fd94d513a6c77f5fd621";

    // console.log(url);

    $.ajax({
      url: url,
      type: "GET",
      crossDomain: true, // enable this
      dataType: 'jsonp',
      success: function(data){ predictParking(data, time); }, //closure function - can pass param in deeper
      error: function(){ console.log('get Data Failed!'); }
    });

  },

  /*
  * Recommends a better time and place to visit destination
  */

  recommend: function(dest){
    alert("You should visit "+dest+" on Weekend evenings");

  }


};



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

    var wD = core.factorInWeekDay();
    console.log("weekday result: "+wD);

    var ToD = core.factorInToD(time);
    console.log("hour result: "+ToD);

    var season = core.factorInSeason();
    console.log("season result: "+season);

    console.log("destination result: "+result);

    //calculate score
    // var totalScore = (wD/deNom) + (ToD/deNom) + (season/deNom) + (result/deNom);
    var totalScore = 0;

    // console.log(totalScore);


    var display_area = $("#result_area");
    // console.dir(display_area);
    display_area.html("");

    if(!isNaN(totalScore)){

      var success ="alert-success";
      var warning ="alert-warning";
      var error="alert-danger";

      if(totalScore >= 0 && totalScore <= 0.5){
        var output = core.buildOutput(error);
        output = output + "it's <strong>VERY UNLIKELY</strong> you'll have parking!<br>Your total parking availability score was <strong>"+(totalScore*100)+"</strong><br>Would you like me to pull up a map of transit transportation? That doesn't require parking! <strong><a onclick=\"app.altRoute();\" class=\"alert-link\">YES</a></strong>/<strong><a class=\"alert-link\">NO</a></strong></p></div>";
        display_area.html(output);
        // console.log(output);

      }else if(totalScore >= 0.6 && totalScore <= 0.8){
        var output = core.buildOutput(warning);
        output = output + "it's <strong>Very Likely</strong> you'll have parking!</p><br>Your total parking availability score was <strong>"+(totalScore*100)+"</strong></div>";
        display_area.html(output);
        console.log(output);

      }else{
        var output = core.buildOutput(success);
        output = output + "<strong>There'll be Parking!</strong> Good Job.</p><br>Your total parking availability score was <strong>"+(totalScore*100)+"</strong></div>";
        display_area.html(output);
        console.log(output);
      }
    }else{
      console.log("Something went wrong in the score calculation");
      display_area.innerHTML = "Something went wrong in the score calculation";
    }
  }

