//connect 3.3v to AREF

const int xPin = A5;
const int yPin = A4;
const int zPin = A3;  
const int radius = 5; //change it!!!
const int mass = 0.2;

int xReading;
int yReading;
int zReading;

unsigned long time_start_low = 0;
unsigned long time_finish = 0;
int monitor_pitch = 0, start_pitch = 0, finish_pitch = 0;
int max_velocity=0, current_velocity = 0;

int roll = 0, pitch = 0, old_pitch = 0;   //Roll & Pitch are the angles which rotate by the axis X and y 


void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
}

void loop() {
 // analogReference(EXTERNAL);    //connect 3.3v to AREF
  delay(100);

  xReading = analogRead(xPin);
  yReading = analogRead(yPin);
  zReading = analogRead(zPin);
  
  int yMapped = map(yReading, -100, 100, 0, 255);
  
//  Serial.print(yMapped - 495);
//  Serial.print("\n");

  monitor_pitch = RP_calculate();//xhange pitch

  //if pitch < some value, start listening
//  Serial.print("monitor pitch is: ");
//  Serial.println(monitor_pitch);
//  
  if (monitor_pitch < 29) {
    time_start_low = millis();
    start_pitch = RP_calculate();
    finish_pitch = 0;
    time_finish = 0;
    max_velocity = 0;
//    Serial.print("start pitch");
//    Serial.println(start_pitch);
  }
  if (monitor_pitch > 38) {
    time_finish = millis();
    finish_pitch = RP_calculate();
//    Serial.print("finish pitch");
//    Serial.println(finish_pitch);
  }

//  Serial.print("start pitch: ");
//  Serial.println(start_pitch);
//  Serial.print("finish pitch: ");
//  Serial.println(finish_pitch);

  double change_in_time = (time_finish - time_start_low)/1000;
//  Serial.print("change_in_time: ");
//  Serial.println(change_in_time);
  
  double angular_velocity = (finish_pitch - start_pitch)/change_in_time;
  
  current_velocity = angular_velocity * radius;

//  Serial.print("current velocity is: ");
//  Serial.println( + current_velocity);
  if (current_velocity>max_velocity && change_in_time != 0) {
    max_velocity = current_velocity;
  }
  Serial.write(max_velocity);
//  Serial.print("velocity square: ");
//  Serial.println(sq(velocity));
  double KE = 0.5 * mass * sq(max_velocity);

//  Serial.print("change in time: ");
//  Serial.println(change_in_time);
//  Serial.print("angular velocity ");
//  Serial.println(angular_velocity);



//  Serial.print("KE= ");
//  Serial.println(KE, 5);

  delay(1);                     
  
}

               //three axis acceleration data
int RP_calculate(){
  double x_Buff = float(xReading);
  double y_Buff = float(yReading);
  double z_Buff = float(zReading);
  roll = atan2(y_Buff , z_Buff) * 57.3;
  pitch = -atan2((- x_Buff) , sqrt(y_Buff * y_Buff + z_Buff * z_Buff)) * 57.3;
//  Serial.print("Roll: ");

  //Serial.println(pitch);
  return pitch;
  
}
