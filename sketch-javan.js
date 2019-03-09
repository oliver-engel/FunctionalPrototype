/*
References for these codes:
https://github.com/yyyuan/arduino-p5-tutorial-complete
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/

var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem14101'    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino

var minWidth = 1000;   //set min width and height for canvas
var minHeight = 600;
var width, height;    // actual width and height for the sketch
var vhistory = []; //graphing the SHIT
let bg; //for bg image
let font; //font placeholder
var speedHistory = []; //array for
var maxSpeed = []; //array of limited length for storing local highest value
var maxVal = 0; //variable for storing highest speed in maxSpeed, used to check against false trials
var trialCount=0; //trial counter
var trialArray=[]; //array for storing the trial counter
let record=false; //recording button
var maxTrials = 10; //max # of trials displayed on screen

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('Montserrat/Montserrat-Bold.ttf');
}

function setup() {
  // set the canvas to match the window size
  if (window.innerWidth > minWidth){
    width = window.innerWidth;
  } else {
    width = minWidth;
  }
  if (window.innerHeight > minHeight) {
    height = window.innerHeight;
  } else {
    height = minHeight;
  }

  textFont(font);
  //set up canvas
  createCanvas(width, height);
  noStroke();
  bg=loadImage('https://i.imgur.com/4kpIB2Z.png'); //unused background image, feel free to substitute

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port

  button = createButton("Record Values");
  button.position(120, height*8/10);
  button.style('font-size', '30px');
  button.mousePressed(clickFunction);
}

//drawing the input data
function draw() {
  // set background to grey
  background(236, 96, 62);
  beginShape();
  noStroke();

  // draws the bars in descending order
  for (var y=1; y<=maxTrials; y+=1) {
    fill(255);
    rect(width/2, height/5+y*50, speedHistory[speedHistory.length-y]*10, height/20);
    fill(0);
    text(speedHistory[speedHistory.length-y], width/2, height*2/9+y*50);
    fill(255);
    text(trialArray[trialArray.length-y], width/2-130, height*2/9+y*50)
  }
  endShape();

  stroke(255);
  strokeWeight(4);
  noFill();

  // converts inData to vdata so the graph doens't take up the whole screen
  var vdata = (1-inData/1800) * height;
  vhistory.push(vdata);

  // maxSpeed stores the most recent inData
  maxSpeed.push(inData);

  // makes sure the graph history is limited in length
  if (vhistory.length >= width*0.28) {
    vhistory.splice(0,1);
  }

  /*
    Cheating the system a bit here, I set a arbitrary length
    of 50 for the maxSpeed array. Basically the array only
    stores inData values for the past 50 loops.
  */
  if (maxSpeed.length >= 50) {
    maxSpeed.splice(0,1);
  }

  // drawing the Y-axis on the graph
  line(120, height*0.415, 120, height*0.555);
  line(115, height*0.415, 120, height*0.415);
  line(115, height*0.555, 120, height*0.555);

  // line graph that changes with inData inputs
  beginShape();
  for (var x=0; x<vhistory.length; x+=1) {
    vertex(x+120,vhistory[x]-height*0.445);

  }

  /*
    Activation threshold of 30 on the serial input, meaning
    everything < 30 is not registered as a valid trial. We
    can set an arbitrary parameter here, but I found 30 to
    feel realistic given the pressure sensor.

    maxVal for the current trial becomes the maximum value
    in the past 50 loops of the maxSpeed array.
  */
  if (inData > 30) {
    maxVal = max(maxSpeed);
  }

  // When the record button is pressed, the maxVal is added to the speed history array
  if (record) {
    trialCount++; //trial count numeric value goes up
    speedHistory.push(maxVal/10); //adds the numeric value of the maximum speed into the trial array
    trialArray.push('trial #'+trialCount); //trial count goes up, doesn't affect the algorithm but it tracks the #
    maxVal = 0;
    record = false;
  }

  // splicing the arrays of old values so there's no memory leak and performance loss as time goes on
  // change the variable maxTrials to set the number of trials that will be displayed on screen
  if (speedHistory.length > maxTrials) {
    speedHistory.splice(0,1);
    trialArray.splice(0,1);
  }

  endShape();
  noStroke();

  // text of current trial values
  beginShape();
  fill(255);
  rect(120, height*7/10, maxVal, height/20);
  endShape();
  textAlign(LEFT);
  text('Current trial', 120, height*6/10);
  text(maxVal/10, 500, height*6/10);

  // top value on the Y axis
  textSize(16);
  textAlign(RIGHT);
  text('25', 110, height*0.415);

  // bottom value on the Y axis
  textSize(16);
  textAlign(RIGHT);
  text('0', 110, height*0.555);

  // inData print on screen for debugging/displaying instantaneous velocity
  textSize(72);
  textAlign(RIGHT);
  text(inData/10, width*0.265, height*0.42);

  // Text on screen JOULES
  textSize(24);
  textAlign(LEFT);
  text('METERS/SECOND', width*0.28, height*0.41);

  // Text on screen to track the value of "record"
  // textSize(24);
  // textAlign(LEFT);
  // text('Recording value:   ' + record, width*0.5, height/5);

  // Text on screen to track the value of canvas dimensions
  // textSize(24);
  // textAlign(LEFT);
  // text('window height:   ' + height, width*0.5, height/6);
  // text('window width:   ' + width, width*0.5, height/7);

}

// Following functions print the serial communication status to the console for debugging purposes

function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

function clickFunction(){
  if (record){
    record = false;
  }
  if (record == false) {
    record = true;
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
