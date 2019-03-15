//connect 3.3v to AREF

const int xPin = A5;
const int yPin = A4;
const int zPin = A3;
const int radius = 5; //change it!!!
const int mass = 0.2;

unsigned long time_start_low = 0;
unsigned long time_finish = 0;
float monitor_pitch = 0, start_pitch = 0, finish_pitch = 0;

float monitor_pitch_sum = 0; // for our sliding window average
const int SLIDING_WINDOW_SIZE = 15;
float pitch_buffer[SLIDING_WINDOW_SIZE];
int readIndex = 0;

float max_velocity = 0, current_velocity = 0;

float roll = 0, pitch = 0, old_pitch = 0;   //Roll & Pitch are the angles which rotate by the axis X and y

float monitor_pitch_full_range = 0;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);

  // initialize the smoothing average array to zero
  for(int i=0; i<SLIDING_WINDOW_SIZE; i++){
    pitch_buffer[i] = 0;
  }
}

void loop() {

  int xReading = analogRead(xPin);
  int yReading = analogRead(yPin);
  int zReading = analogRead(zPin);

  // Smoothing code based on https://www.arduino.cc/en/tutorial/smoothing
  monitor_pitch = calculatePitch(xReading, yReading, zReading);//xhange pitch
  monitor_pitch_sum = monitor_pitch_sum - pitch_buffer[readIndex]; 
  pitch_buffer[readIndex] = monitor_pitch;
  monitor_pitch_sum = monitor_pitch_sum + pitch_buffer[readIndex];
  readIndex++;

  // if we're at the end of the array...
  if (readIndex >= SLIDING_WINDOW_SIZE) {
    // ...wrap around to the beginning:
    readIndex = 0;
  }

  float avgPitch = monitor_pitch_sum / (float)SLIDING_WINDOW_SIZE;
  
  //Serial.print(monitor_pitch,2);
  //Serial.print(",");
  Serial.println(avgPitch,4);
    
  delay(10);
}

/**
   This function calculates the trebuchet pitch from accelerometer readings
*/
float calculatePitch(int xReading, int yReading, int zReading) {
  double x_Buff = double(xReading);
  double y_Buff = double(yReading);
  double z_Buff = double(zReading);

  // We no longer need to calculate roll but keeping this code snippet here
  // in case we change our mind
  // roll = atan2(y_Buff , z_Buff) * 57.3;

  //float curPitch = -atan2((-xReading) , sqrt(yReading * yReading + zReading * zReading)) * 57.3;
  float curPitch = -atan2((- x_Buff) , sqrt(y_Buff * y_Buff + z_Buff * z_Buff)) * 57.3;

  return curPitch;
}
