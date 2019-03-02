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

let angle = 0;
let transparency = 255;
var projectile = true;
var launchSound;





function setup() {


  width=1200;
  height=800;

  //set up canvas
  createCanvas(width, height);
  angleMode(DEGREES);
  noStroke();

  //images
  support = loadImage('assets/support.png');
  arm = loadImage('assets/arm.png');
  weight = loadImage('assets/weight.png');
  ready = loadImage('assets/ready_2.png');
  ball = loadImage('assets/ball.png');



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


function draw() {
  // set background to black
  background(30, 30, 30);
  smooth(0);

  //Get the angle; for Arduino-less testing, keep as mouseX.
  //If you have the arduino set up, change 'mouseX' to 'inData'.
  var angle = map(mouseX,0,255,0,300);

  console.log(angle);

  //Scale and translate the whole thing
  scale(.55);
  translate(500,500);

  push();
      //Set the position
      translate(575,285);

      //Keep the arm between 45 and 270 degrees
      var armSwing = constrain(angle, 45, 270);

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
  inData = Number(serial.read());
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
