#ifndef ARDUINO_MQTTCONNECTOR_H
#define ARDUINO_MQTTCONNECTOR_H

#include <Arduino.h>

#define MQTT_BROKER       "www.terasyshub.io"
#define MQTT_BROKER_PORT  1883

void    MQTTBegin();
void    MQTTLoop();
boolean MQTTPublish(const char* topic, const char* payload);
boolean MQTTSubscribe(const char* topicToSubscribe);
boolean MQTTConnected();

#endif /* ARDUINO_MQTTCONNECTOR_H */
