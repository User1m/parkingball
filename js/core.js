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
      result = 0.025;
      break;

      case 3:
      case 4:
      case 5:
      season ="spring";
      result = 0.0125;
      break;

      case 6:
      case 7:
      case 8:
      season ="summer";
      result = 0.0125;
      break;

      case 9:
      case 10:
      case 11:  //november
      season ="fall";
      result = 0.0125;
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
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      result = 0.1; //40% of 0.042
      break;

      case 0:
      case 6:
      result = 0.15; //40% of 0.042
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
        result = 0.003123; //30% of 0.01042

      }else if(hour >= 6 && hour <= 11){
        result = 0.001042; //10% of 0.01042

      }else if(hour >= 12 && hour <= 15){
        result = 0.001042; //10% of 0.01042

      }else if(hour >= 16 && hour <= 20){
        result = 0.002084; //20% of 0.01042

      }else{
        result = 0.003123; //30% of 0.01042

      }
    }

    // console.log("facorInToD result: "+result);
    return result;

  },


  buildOutput: function (status){

  // output string to be combined with a predictoin string
  var output ="<div class=\"alert alert-"+status+" alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>From what I can tell...";

  return output;
},


  /*
  * Function to retrieve data
  */

  getData: function (dest, time, version){

    var url = "https://api.parkwhiz.com/search/?destination="+dest+"&key=12189e4e3e18fd94d513a6c77f5fd621";

    // console.log(url);

    $.ajax({
      url: url,
      type: "GET",
      crossDomain: true, // enable this
      dataType: 'jsonp',
      success: function(data){ predictParking(data, time, version); }, //closure function - can pass param in deeper
      error: function(){ console.log('get Data Failed!'); }
    });

  },

  /*
  * Recommends a better time and place to visit destination
  */

  recommend: function(dest){
    // alert("You should visit "+dest+" on Weekend evenings");

    var currDate = this.getTheDate();
    currDay = currDate.getDay();

    var weekDayHours = ["12am-5am", "4pm-8pm", "9pm-11pm"];
    var weekendHours = ["12am-5am", "7am-12pm", "1pm-3pm", "9pm-11pm"];

    var rand, output, hours;

    if(currDay == 0 || currDay == 6){
      //weekend
      rand = Math.floor(Math.random()*4);
      hours = weekendHours[rand];
      output = "Well then I would recommend visiting "+dest+" on a weekend between the hours of "+hours+" when there's a higher likelihood that you'll have parking!";

    }else{
      //weekday
      rand = Math.floor(Math.random()*3);
      hours = weekDayHours[rand];
      output = "Well then I would recommend visiting "+dest+" on a weekday between the hours of "+hours+" when there's a higher likelihood that you'll have parking!";
    }

    return output;

  }


};



  /*
  * Method predicts the availability of parking around a destinaion
  */
  function predictParking(data, time, version){

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
      result = 0.00625; //10% of 0.0625

    }else if(parkingCount >= 1 && parkingCount <= 10){
      result = 0.00625; //10% of 0.0625

    }else if(parkingCount >= 11 && parkingCount <= 20){
      result = 0.1875; //30% of 0.0625

    }else{
      result = 0.03125; //50% of 0.0625

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

    if(version == "app"){
      var display_area = $("#result_area");
    }else{
      var display_area = $("#ext_result_area");
    }

    display_area.html("");

    if(!isNaN(totalScore)){

      var success ="success";
      var warning ="warning";
      var error="danger";

      if(totalScore >= 0 && totalScore <= 0.5){
        var output = core.buildOutput(error);

        if(version == "app"){
          output = output + "it's <strong>VERY UNLIKELY</strong> you'll have parking!<br>Your total Parking Availability Score <strong>(P.A.S)</strong> was <strong>"+(totalScore*100)+"</strong><br>Would you like me to pull up an alternate route using transit transportation, which doesn't require parking? <strong><a onclick=\"app.altRoute('y');\" class=\"alert-link\">YES</a></strong>/<strong><a onclick=\"app.altRoute('n');\" class=\"alert-link\">NO</a></strong></p></div>";
        }else{
          output = output + "it's <strong>VERY UNLIKELY</strong> you'll have parking!<br>Your total Parking Availability Score <strong>(P.A.S)</strong> was <strong>"+(totalScore*100)+"</strong></p></div>";
        }

        display_area.html(output);
        // console.log(output);
      }else if(totalScore >= 0.6 && totalScore <= 0.8){
        var output = core.buildOutput(warning);

        if(version == "app"){
          output = output + "it's <strong>Very Likely</strong> you'll have parking!<br>Your total Parking Availability Score <strong>(P.A.S)</strong> was <strong>"+(totalScore*100)+"</strong><br>Would you like me to pull up an alternate route using transit transportation, which doesn't require parking? <strong><a onclick=\"app.altRoute('y');\" class=\"alert-link\">YES</a></strong>/<strong><a onclick=\"app.altRoute('n');\" class=\"alert-link\">NO</a></strong></p></div>";
        }else{
          output = output + "it's <strong>Very Likely</strong> you'll have parking!<br>Your total Parking Availability Score <strong>(P.A.S)</strong> was <strong>"+(totalScore*100)+"</strong></p></div>";
        }

        display_area.html(output);
        // console.log(output);

      }else{
        var output = core.buildOutput(success);

        if(version == "app"){
          output = output + "<strong>There'll be Parking!</strong> Good Job.<br>Your total Parking Availability Score <strong>(P.A.S)</strong> was <strong>"+(totalScore*100)+"</strong><br>Would you like me to pull up an alternate route using transit transportation, which doesn't require parking? <strong><a onclick=\"app.altRoute('y');\" class=\"alert-link\">YES</a></strong>/<strong><a onclick=\"app.altRoute('n');\" class=\"alert-link\">NO</a></strong></p></div>";
        }else{
          output = output + "<strong>There'll be Parking!</strong> Good Job.<br>Your total Parking Availability Score <strong>(P.A.S)</strong> was <strong>"+(totalScore*100)+"</strong></p></div>";
        }

        display_area.html(output);
        // console.log(output);
      }
    }else{
      console.log("Something went wrong in the score calculation");
      display_area.html("Something went wrong in the score calculation");
    }
  }

