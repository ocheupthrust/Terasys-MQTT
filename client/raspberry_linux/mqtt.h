#ifndef RASPBERRY_MQTT
#define RASPBERRY_MQTT

/* MQTT credentials */
#define MQTT_CLIENT_ID      "YOUR_CLIENT_ID_OR_MAC"
#define MQTT_USERNAME       "YOUR_MQTT_USER"
#define MQTT_PASSWORD       "YOUR_MQTT_PASSWORD"
#define MQTT_TOPIC          "YOUR_MQTT_TOPIC"

/* MQTT configs */
#define MQTT_BROKER_ADDR    "tcp://www.terasyshub.io"
#define MQTT_QOS            1
#define TIMEOUT             10000L
#define KEEP_ALIVE          20

void MQTTBegin();
void MQTTSubscribe(const char* topic);
void MQTTPublish(const char* topic, char* payload);
void MQTTDisconnect();

#endif /* RASPBERRY_MQTT */
