/*--------------------------------------------------
Appear Plugin
---------------------------------------------------*/

!function(e){e.fn.appear=function(a,r){var n=e.extend({data:void 0,one:!0,accX:0,accY:0},r);return this.each(function(){var r=e(this);if(r.appeared=!1,!a)return void r.trigger("appear",n.data);var p=e(window),t=function(){if(!r.is(":visible"))return void(r.appeared=!1);var e=p.scrollLeft(),a=p.scrollTop(),t=r.offset(),c=t.left,i=t.top,o=n.accX,f=n.accY,s=r.height(),u=p.height(),d=r.width(),l=p.width();i+s+f>=a&&a+u+f>=i&&c+d+o>=e&&e+l+o>=c?r.appeared||r.trigger("appear",n.data):r.appeared=!1},c=function(){if(r.appeared=!0,n.one){p.unbind("scroll",t);var c=e.inArray(t,e.fn.appear.checks);c>=0&&e.fn.appear.checks.splice(c,1)}a.apply(this,arguments)};n.one?r.one("appear",n.data,c):r.bind("appear",n.data,c),p.scroll(t),e.fn.appear.checks.push(t),t()})},e.extend(e.fn.appear,{checks:[],timeout:null,checkAll:function(){var a=e.fn.appear.checks.length;if(a>0)for(;a--;)e.fn.appear.checks[a]()},run:function(){e.fn.appear.timeout&&clearTimeout(e.fn.appear.timeout),e.fn.appear.timeout=setTimeout(e.fn.appear.checkAll,20)}}),e.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(a,r){var n=e.fn[r];n&&(e.fn[r]=function(){var a=n.apply(this,arguments);return e.fn.appear.run(),a})})}(jQuery);

/*--------------------------------------------------
Function AppearItem
---------------------------------------------------*/

	function AppearItem() {
    console.log('hey 2');
		$('.has-animation').each(function() {
			$(this).appear(function() {
				$(this).delay($(this).attr('data-delay')).queue(function(next){
					$(this).addClass('animate-in');
					next();

				});
			});
		});

	}//End AppearItem


	/*--------------------------------------------------
	First-time functions
	---------------------------------------------------*/

$( document ).ready(function() {

  AppearItem();

	$('.showing-challenge').hide();
	$('.challenge-toggler').fadeTo( "fast", .33 );

	makeChart("chart-1");
	// makeChart("chart-2");
	// makeChart("chart-3");
	// makeChart("chart-2", 6);
	// makeChart("chart-3");
	potentialEnergy(0);

  appendChart();
	//makeChart("chart-3");


});

/*--------------------------------------------------
Adding charts to the list under experiments
---------------------------------------------------*/

var trialValue = 0;

function appendChart(){
	$( ".trial-list" ).prepend( "<div class='trial' id='trial-x'><div class='trial-header'><section id='trial-number-name'>Trial bitch</section><section class='weight-number'><i class='fas fa-weight-hanging'></i>&nbsp; <span id='weight-tracking'>5 Weights</span></section></div><div class='trial-potential'><section class='potential-graph'><canvas id='chart-3' width='400' height='200'></canvas></section></div></div>" );

	// var chartID = document.getElementById("chart-x");
	// chartID.innerHTML = "chart-3";

	makeChart("chart-3");

	//Change this later
	trialValue++;

	var trialNumName = document.getElementById("trial-number-name");
	trialNumName.innerHTML = "Trial #" + trialValue;

	var numWeights = document.getElementById("weight-tracking");
	numWeights.innerHTML =  globalWeight + " Weights";

	// var chartID = document.getElementById("chart-x");
	// chartID.innerHTML = "chart-" + trialValue;

	// var potentialEValue = document.getElementById("trial-number-name")
	// potentialEValue.innerHTML = curPotentialEnergy;

	// var trialNum = document.getElementById("trial-x");
	// trialNum.id = "trial-3";
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
              data: [curPotentialEnergy, 10],
              backgroundColor: [
                  'rgb(236, 96, 62)',
                  'rgb(236, 208, 63)'
              ],
              borderWidth: 0
          }]
      },
      options: {
        scaleShowVerticalLines: false,
        legend:{
          display:false
        },
          scales: {
              xAxes: [{
                  ticks: {
											//Set max value on horizontal scale here
											max:50,
                      beginAtZero:true,
                      fontColor: "#CCC"
                  },
                  gridLines:{
                    display : false
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




var globalWeight=0;
var curPotentialEnergy=0;


function incrementValue()
{
    var value = parseInt(document.getElementById('weight-changer').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('weight-changer').value = value;
		document.getElementById('weight-changer').innerHTML = value;
		globalWeight=value;

		//Make update to the potential energy
		//Plug in (m)(g)(h) here
		potentialEnergy(globalWeight * 9 * .5);
}

function decrementValue()
{
    var value = parseInt(document.getElementById('weight-changer').value, 10);
    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById('weight-changer').value = value;
		document.getElementById('weight-changer').innerHTML = value;
		globalWeight=value;

		//Make update to the potential energy
		//Plug in (m)(g)(h) here
		potentialEnergy(globalWeight);
}

//Setting potential energy value
function potentialEnergy(value){
	document.getElementById("potential-energy-value").innerHTML = value + " J";
	curPotentialEnergy = value;
}

//Toggling the experiment section
$('.experiment-toggler').on(
  'click',
  function()
  {
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
    $('.showing-experiment').hide();
		$('.showing-challenge').show();
		$('.challenge-toggler').fadeTo( "fast", 1 );
		$('.experiment-toggler').fadeTo( "fast", .33 );
		document.getElementById("ch").style.borderBottom = "3px solid white";
		document.getElementById("xp").style.borderBottom = "none";
  }
);
