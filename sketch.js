/*
P5.js setup code was sourced from these links:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/

var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem144401';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino

var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch


let transparency = 255;
var projectile = true;
var launchSound;

var sendVal = 5;

let cloud_1_x = 0;
let dim =80.0;

var smoothedSensor = 0;



function setup() {


  width=1200;
  height=800;

  //set up canvas
  var widthParent = document.getElementById('trebuchet-animation-holder').offsetWidth;
  var heightParent = document.getElementById('trebuchet-animation-holder').offsetHeight;

  var canvas = createCanvas(widthParent, 450);
  canvas.parent('trebuchet-animation-holder');
  console.log(heightParent);
  angleMode(DEGREES);
  noStroke();

  //images
  support = loadImage('assets/support-transp.png');
  arm = loadImage('assets/arm.png');
  weight = loadImage('assets/weight-transp.png');
  ready = loadImage('assets/ready.png');
  ball = loadImage('assets/ball.png');
  cloud_1 = loadImage('assets/cloud-1.png');

  //Set up communication port
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

//Ball positions
var ballX = 465;
var ballY = -100;
let alpha = 0;

let bgColor = '#EC603E';

let angle=0;
let oldAngle = 0;
let newAngle = 0;

//Main loop
function draw() {

  // console.log(map(inData, 0, 1023, 45, 200));

  // set background to black
  background(bgColor);
  smooth(0);

  push();
    cloud_1_x = cloud_1_x + 0.8;

    // console.log("cloud_1_x" + cloud_1_x);

    if (cloud_1_x > 3500) {
      cloud_1_x = -600;
    }
    scale(.35);
    translate(cloud_1_x, height / 2 - dim / 2);
    // rect(-dim / 2, -dim / 2, dim, dim);
    blendMode(SCREEN);
    image(cloud_1, -600, 150);
  pop();


  // Get the angle; for Arduino-less testing, change inData to mouseX.
  // If you have the arduino set up, change mouseX to inData'.
  // Change the last variable to alibrate the resting position of the arm.
  var angle = map(inData, 29, 40, 45, 190);
  // print(angle);

  //Scale and translate the whole thing
  scale(.4);
  translate(610,375);

  push();
      //Set the position
      translate(575,285);

      //Keep the arm between 45 and 270 degrees

      var armSwing = constrain(angle, 45, 270);
      console.log(armSwing);
      // console.log(angle);

      // var weightx = constrain(mx, 0,140);
      rotate(-armSwing + 90);

      //If the arm is less than 180 degrees, and hasn't been launched yet
      if(armSwing < 180 && projectile == true){

        image(ball,ballX,ballY);
      }

      //If the arm passes 180
      else if(armSwing > 180){
        //Sound

        //Can't fire again until reloaded
        projectile = false;
        //Add a motion trail
        background(34, 36, 43, 1);
        //Rate of firing
        ballX += 25;

        //Animate the ball
        push();
          rotate(random(1));
          imageMode(CENTER);
          image(ball,ballX,ballY);
        pop();

        //DEBUGGING
        // fill(255);
        // text(ballX + ", " + ballY, ballX, ballY);

      }

      //BALL RESET
      else if(armSwing < 46){
        projectile = true;
        ballX = 465;
        ballyY = -100;
        image(ball,ballX,ballY);
      }

      //Draw the arm

      image(arm, -143, -50);
      translate(-115,0);

      //Rotating the arm based on sensor input
      rotate(armSwing-90);

      //Draw the weight
      imageMode(CENTER);

      image(weight,0,75);

      if(armSwing > 180){
        //Do stuff when the arm hits 180 degrees
      }

  pop();




  //Draw the support
  image(support, 212, 225);

  //Draw "ready" message
  if(armSwing < 50){
    //Set the position
    translate(360,750);
    push();
      //Altering transparency over time
      tint(255, transparency);
      transparency-=3;
      scale(.75);
      image(ready, 0,0);

      //If transparent, reset
      if(transparency < 1){
        transparency=255;
      }
    pop();
  }
}




// DONT TOUCH THIS
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
  // inData = Number(serial.read());
  // print(inData);

  // read a string from the serial port:
  var inString = serial.readLine();
  // check to see that there's actually a string there:
  if (inString.length > 0 ) {
    // convert it to a number:
    inData = Number(inString);
    // print(inData);
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
