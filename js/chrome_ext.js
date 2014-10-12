window.addEventListener('load', function(){

  document.getElementById('submit').addEventListener('click', ext.init);

});

var ext = {

  init:function(){
    var map = $("#ext_map_canvas");

    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var time = document.getElementById('time').value;


    start = escape(start);
    end = escape(end);
    var timeOfDay = time.split(":")[0];


    var output =  "<iframe width=\"600\" height=\"250\" frameborder=\"0\" style=\"border:0\" src=\"https://www.google.com/maps/embed/v1/directions?key=AIzaSyBuktrfAE2xOQjTT8LpK9cxm80aPgRxYvk&origin="+start+" &destination="+end+"\"></iframe>";

    map.html(output);

    core.getData(end,timeOfDay,"ext");

  },

};


document.addEventListener("DOMContentLoaded", function(event) {
  // console.log("DOM fully loaded and parsed");
  // document.getElementById("webview").addEventListener('onclick', );

  $('#webview').click(chrome.tabs.create({ url: "http://claudiusmbemba.com/dev/parkingpredictor/" }));


});

