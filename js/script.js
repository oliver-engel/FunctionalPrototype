

/*--------------------------------------------------
First-time functions
---------------------------------------------------*/

$( document ).ready(function() {

  AppearItem();
	$('.showing-challenge').hide(); // Deactivate challenge section on start
	$('.challenge-toggler').fadeTo( "fast", .33 );

	hideAllChallenges(); // Make sure challenges are hidden on start

});

/*--------------------------------------------------
Adding charts to the list under experiments
---------------------------------------------------*/

var trialValue = 0;

function prependChart(className){
	//DOM material to inject into experiment section
	$( className ).prepend( "<div class='trial' id='trial-x'><div class='trial-header'><section id='trial-number-name'>Trial #</section><section class='weight-number'><i class='fas fa-weight-hanging'></i>&nbsp; <span id='weight-tracking'>5 Weights</span></section></div><div class='trial-potential'><section class='potential-graph'><canvas id='chart' width='400' height='200'></canvas></section></div></div>" );

	console.log("kinetic energy: " +  kineticEnergy);

	//Create the chart
	makeChart("chart");

	//Counting up the number of trials
	trialValue++;

	//Setting the name of the trial
	var trialNumName = document.getElementById("trial-number-name");
	trialNumName.innerHTML = "Trial #" + trialValue;

	//Setting the number of weights used
	var numWeights = document.getElementById("weight-tracking");
	numWeights.innerHTML =  globalWeight + " Weights";

}

function appendChart(className){
  $( className ).append( "<div class='trial' id='trial-x'><div class='trial-header'><section id='trial-number-name'>Trial #</section><section class='weight-number'><i class='fas fa-weight-hanging'></i>&nbsp; <span id='weight-tracking'>5 Weights</span></section></div><div class='trial-potential'><section class='potential-graph'><canvas id='chart' width='400' height='200'></canvas></section></div></div>" );

}


/*--------------------------------------------------
Drawing new charts
---------------------------------------------------*/
function makeChart(id){

  var ctx = document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: ["", ""],
          datasets: [{
              label: ' Joules of energy',
							//Taking in the data. Replace second number with kinetic energy.
              data: [curPotentialEnergy, kineticEnergy],
              backgroundColor: [
                  'rgb(236, 96, 62)',
                  'rgb(236, 208, 63)'
              ],
              borderWidth: 0
          }]
      },
      options: {
        scaleShowVerticalLines: false,
        scaleLineColor: "#fff",
        legend:{
          display:false
        },
          scales: {
              xAxes: [{
                  ticks: {
											//Set max value on horizontal scale here
											max:250,
                      beginAtZero:true,
                      fontColor: "#CCC"
                  },
                  gridLines:{
                    display : false,
                    color: "#fff",

                  }
              }],
              yAxes: [{
                gridLines:{
                  display : false
                }
                }],
          },
          responsive: true,
          maintainAspectRatio: false,
          layout: {
          padding: {
              left: -20,
              right: 0,
              top: 0,
              bottom: 0
          }
        }
      }
  });
}


var globalWeight=1; // keep track of weights inputted
var projectileWeight = 0;
var weightFactor = .25; // change as needed
var curPotentialEnergy=0;
var potentialEnergyHeight = 12; // change as needed
var gravitationalConstant = 10;

// Setting potential energy value
function potentialEnergy(value){
	document.getElementById("potential-energy-value").innerHTML = value + " J";
	curPotentialEnergy = value;
}

// Increment number of weights
function incrementValue()
{
    if(globalWeight >= 0){ // only increment if > 0
      var value = parseInt(document.getElementById('weight-changer').value, 10);
      value = isNaN(value) ? 0 : value;
      value++;
      document.getElementById('weight-changer').value = value;
  		document.getElementById('weight-changer').innerHTML = value;
  		globalWeight=value;
      projectileWeight = weightFactor * globalWeight;

  		// Make update to the potential energy
  		// Plug in (m)(g)(h) here
  		potentialEnergy(globalWeight * gravitationalConstant * potentialEnergyHeight);
    }
}

// Decrement number of weights
function decrementValue()
{
  if(globalWeight >= 1){ //only decrement if > 0
    var value = parseInt(document.getElementById('weight-changer').value, 10);
    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById('weight-changer').value = value;
		document.getElementById('weight-changer').innerHTML = value;
		globalWeight=value;

		// Make update to the potential energy
		// Plug in (m)(g)(h) here
		potentialEnergy(globalWeight * gravitationalConstant * potentialEnergyHeight);
  }
}





//Toggling the experiment section
$('.experiment-toggler').on(
  'click',
  function()
  {
    challengeMode = false;
    $('.showing-experiment').show();
		$('.showing-challenge').hide();
		$('.experiment-toggler').fadeTo( "fast", 1 );
		$('.challenge-toggler').fadeTo( "fast", .33 );
		document.getElementById("xp").style.borderBottom = "3px solid white";
		document.getElementById("ch").style.borderBottom = "none";
  }
);

//Toggling the challenge section
$('.challenge-toggler').on(
  'click',
  function()
  {
    challengeMode = true;
    $('.showing-experiment').hide();
		$('.showing-challenge').show();
		$('.challenge-toggler').fadeTo( "fast", 1 );
		$('.experiment-toggler').fadeTo( "fast", .33 );
		document.getElementById("ch").style.borderBottom = "3px solid white";
		document.getElementById("xp").style.borderBottom = "none";
  }
);


function preload(){

mainSong = loadSound ("assets/interface/medieval.mp3");
challengeSong = loadSound ("assets/interface/battle.mp3");

}

function togglePlaying(songName){
  if(!songName.isPlaying()){
    songName.play();

    var change = document.getElementById("playMute");
    change.classList.remove("fa-volume-off");
    change.classList.add("fa-volume-up");
    
  }
  else{
    songName.pause();
  }
}

// function loaded(){
//   medievalSong.play();
// }


var toggle = true;

//Playing music. Need to fix the icon issue
function PlaySound(filename) {

  var path = "/assets/interface/";
  var snd = new Audio(path + filename + ".mp3");

	if(toggle){

	   snd.play();
     var change = document.getElementById("playMute");
		 change.classList.remove("fa-volume-off");
		 change.classList.add("fa-volume-up");

		 toggle = !toggle;
     console.log("playgin");
	}

	else if (!toggle){
	   // var music = document.getElements("video1");
		 // music.muted = true;
console.log("pausing");
     snd.pause();

		 var change2 = document.getElementById("playMute");
		 change2.classList.remove("fa-volume-up");
		 change2.classList.add("fa-volume-off");

		 toggle = true;

				}
}

var challengeSectionTracker=0;
var challengeMode = false;
var goalEnergy = 0;

//The progression of screens for the challenge sidebar
$(".challenge-advancer").click(function(){

	if(challengeSectionTracker == 0){
  	$("#challenge-empty").hide();
		$("#challenge-countdown").show();
    countdown();
    goalEnergy = 50;
		challengeSectionTracker++;
	}

  else if(challengeSectionTracker == 1){

    challengeSectionTracker++;
  }
});

$(".challenge-decreaser").click(function(){
	challengeSectionTracker--;
});


//Make sure all the challenge screens are hidden on start.
//These get revealed as the kids navigate through the challenge sidebar.
//Make sure to add in the IDs of all new sections that are added.
function hideAllChallenges(){
	$("#challenge-players").hide();
	$("#challenge-countdown").hide();
	$("#challenge-holder-1").hide();
}

//Stores the number of selected players
var numPlayers = 0;

//Functionality for the player selection buttons
$('.grid-4 button').on('click', function(){
    $('.grid-4 button.current-button').removeClass('current-button');
    $(this).addClass('current-button');

		//Update the number of players
		numPlayers = $(this).closest(".current-button").attr("id");
});


/*--------------------------------------------------
CHALLENGE MODE
---------------------------------------------------*/

// ("#challenge-holder-1")







/*--------------------------------------------------
Changing the colors on tab switch
---------------------------------------------------*/

function changeColorsTheme1(){
	bgColor='#EC603E';
	document.documentElement.style.setProperty('--red', '#EC603E');
	document.documentElement.style.setProperty('--dark-red', '#3C1911');
	document.documentElement.style.setProperty('--darker-red', '#311009');
	document.documentElement.style.setProperty('--yellow', '#ECD03E');

}

function changeColorsTheme2(){
	bgColor='#2381ea';
	document.documentElement.style.setProperty('--red', '#2381ea');
	document.documentElement.style.setProperty('--dark-red', '#014b8e');
	document.documentElement.style.setProperty('--darker-red', '#012b54');
	document.documentElement.style.setProperty('--yellow', '#FDCCF2');
}



/*--------------------------------------------------
Appear Plugin
---------------------------------------------------*/

!function(e){e.fn.appear=function(a,r){var n=e.extend({data:void 0,one:!0,accX:0,accY:0},r);return this.each(function(){var r=e(this);if(r.appeared=!1,!a)return void r.trigger("appear",n.data);var p=e(window),t=function(){if(!r.is(":visible"))return void(r.appeared=!1);var e=p.scrollLeft(),a=p.scrollTop(),t=r.offset(),c=t.left,i=t.top,o=n.accX,f=n.accY,s=r.height(),u=p.height(),d=r.width(),l=p.width();i+s+f>=a&&a+u+f>=i&&c+d+o>=e&&e+l+o>=c?r.appeared||r.trigger("appear",n.data):r.appeared=!1},c=function(){if(r.appeared=!0,n.one){p.unbind("scroll",t);var c=e.inArray(t,e.fn.appear.checks);c>=0&&e.fn.appear.checks.splice(c,1)}a.apply(this,arguments)};n.one?r.one("appear",n.data,c):r.bind("appear",n.data,c),p.scroll(t),e.fn.appear.checks.push(t),t()})},e.extend(e.fn.appear,{checks:[],timeout:null,checkAll:function(){var a=e.fn.appear.checks.length;if(a>0)for(;a--;)e.fn.appear.checks[a]()},run:function(){e.fn.appear.timeout&&clearTimeout(e.fn.appear.timeout),e.fn.appear.timeout=setTimeout(e.fn.appear.checkAll,20)}}),e.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(a,r){var n=e.fn[r];n&&(e.fn[r]=function(){var a=n.apply(this,arguments);return e.fn.appear.run(),a})})}(jQuery);

/*--------------------------------------------------
Function AppearItem
---------------------------------------------------*/

	function AppearItem() {
		$('.has-animation').each(function() {
			$(this).appear(function() {
				$(this).delay($(this).attr('data-delay')).queue(function(next){
					$(this).addClass('animate-in');
					next();
				});
			});
		});

	}//End AppearItem
