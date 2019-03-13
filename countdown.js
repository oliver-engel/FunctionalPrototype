  var seconds;
  var temp;

  function countdown() {
    $(temp).fadeTo( 0 , 1);
    seconds = document.getElementById('countdown').innerHTML;
    seconds = parseInt(seconds, 4);

    if (seconds == 1) {
      temp = document.getElementById('countdown');
      // temp.innerHTML = "all done, bye bye";
      $(temp).hide();
      return;
    }

    seconds--;
    temp = document.getElementById('countdown');
    temp.innerHTML = seconds;
    timeoutMyOswego = setTimeout(countdown, 1500);
    $(temp).fadeTo( 1500 , 0);
  }

  // countdown();



 // $( "#book" ).fadeTo( "slow" , 0.5,
