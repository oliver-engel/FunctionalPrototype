//Countdown timer for starting the challenges section.

var seconds;
var temp;

function countdown() {
  $(temp).fadeTo( 0 , 1);
  seconds = document.getElementById('countdown').innerHTML;
  seconds = parseInt(seconds, 4);

  if (seconds == 1) {
    temp = document.getElementById('countdown');
    // temp.innerHTML = "Let's go!";
    $(temp).hide();
    console.log("DID IT");
    $("#challenge-countdown").hide();
    $("#challenge-holder-1").show();
    return;
  }

  seconds--;
  temp = document.getElementById('countdown');
  temp.innerHTML = seconds;
  timeoutMyOswego = setTimeout(countdown, 1500);
  $(temp).fadeTo( 1500 , 0);
  }
