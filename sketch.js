/*
References for these codes:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/

var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino

var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

let angle = 0;

function setup() {
  // set the canvas to match the window size
  // if (window.innerWidth > minWidth){
  //   width = window.innerWidth;
  // } else {
  //   width = minWidth;
  // }
  // if (window.innerHeight > minHeight) {
  //   height = window.innerHeight;
  // } else {
  //   height = minHeight;
  // }
  width=1200;
  height=800;

  //set up canvas
  createCanvas(width, height);
  angleMode(DEGREES);
  noStroke();

  //images
  support = loadImage('assets/support.png');
  arm = loadImage('assets/arm.png');

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
}

function draw() {
  // set background to black
  background(34, 36, 43);
  smooth(0);


  scale(.5);
  translate(500,500);
  push();
  translate(575,285);
  var mx = constrain(mouseX, 45, 270);
  rotate(-mx + 90);
  image(arm, -143, -50);
  // translate(-558,-230);
  pop();

  image(support, 212, window.innerHeight/4);

  angle = angle - 1;



}

// Following functions print the serial communication status to the console for debugging purposes

function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
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
