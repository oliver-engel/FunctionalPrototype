/*
* KINETIC ENERGY CALCULATING SCRIPT
* BY OLIVER ENGEL
* oliverengel.com
*/

var startTime, endTime = 0;

// Change these once units are figured out
var pitchDiff = 11;
var radius = 12;
var mass = .5;
var kineticEnergy = 0;

var sendingValue = true;
// var saveStart = 0;
// var saveEnd = 0;

function energyListen() {

  // If the arm dips to the starting position, start listening
  if(inData < 29){
    startTime = new Date();
    sendingValue = true;
  }

  var saveTimeDiff = 0;

  // If the arm passes the launch position, save the Kinetic Energy value.
  if(inData > 40){
    endTime = new Date();


    // Only do so if the start time has a value (failsafe)
    if(startTime > 0 && sendingValue == true){

      var curTimeDiff = endTime - startTime; //in ms
      curTimeDiff /= 1000; //strip ms


      // saveTimeDiff = curTimeDiff;

      if(saveTimeDiff <= curTimeDiff){
        saveTimeDiff = curTimeDiff;
      }

      var angularVelocity = pitchDiff / saveTimeDiff;
      var actualVelocity = radius * angularVelocity;

      kineticEnergy = ((0.5 * mass * Math.pow(actualVelocity, 2))/10000).toFixed(1);
      console.log(kineticEnergy);

      document.getElementById("kinetic-energy-value").innerHTML = kineticEnergy + " J";

      sendingValue = false;
    }
  }


// console.log(saveEnd);


};

function end() {
  endTime = new Date();
  saveEnd = endTime;
  var timeDiff = saveEnd - saveStart; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff);
  // console.log(seconds + " seconds");
}
