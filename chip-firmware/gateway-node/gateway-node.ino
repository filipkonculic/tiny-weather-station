#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT11.h>
#include "esp_sleep.h"

// Replace with your network credentials
const char* ssid = "";
const char* password = "";

// Firebase configuration (from Firebase console)
#define FIREBASE_HOST ""
#define FIREBASE_AUTH ""
// DHT11 Data pin
#define DHT11_PIN 2

// Create Firebase Data object
FirebaseData firebaseData;
// Define FirebaseConfig object
FirebaseConfig firebaseConfig;
// Define FirebaseAuth object
FirebaseAuth firebaseAuth;
//Define DHT11 object
DHT11 dht11(DHT11_PIN);

void setup() {
  // Start serial communication
  Serial.begin(9600);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println(".");
  }
  Serial.println("Connected to WiFi");

  // Set up Firebase configuration using FirebaseConfig object
  firebaseConfig.host = FIREBASE_HOST;  // Firebase Realtime Database URL
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;  // Firebase Database secret
  
  // Initialize Firebase
  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);

  //Firebase.setwriteSizeLimit(firebaseData, "tiny");
  //Set sleep duration to 5 minutes
  uint64_t sleep_duration = 5 * 60 * 1000000;
  esp_sleep_enable_timer_wakeup(sleep_duration);
}

void loop() {
  
  int temperature = 0;
  int humidity = 0;

  // Attempt to read the temperature and humidity values from the DHT11 sensor.
  int result = dht11.readTemperatureHumidity(temperature, humidity);

  if (result == 0){
    FirebaseJson json;
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("timestamp/.sv", "timestamp"); //Unix timestamp provided by Firebase
    // Push new data to "/sensor_logs"
    if (Firebase.pushJSON(firebaseData, "/sensor_logs", json)) {
      Serial.println("Data pushed to Firebase");
      Serial.println("Generated key: " + firebaseData.pushName()); // Unique ID
    } else {
      Serial.println("Failed to push data: " + firebaseData.errorReason());
    }
  }else{
    Serial.println(DHT11::getErrorString(result));
  }
  esp_deep_sleep_start();
}