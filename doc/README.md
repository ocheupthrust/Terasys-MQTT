# TerasysHUB IoT Platform - MQTT Implementation

This document highlights how to accomplish broker installation, configuration, running and testing phases.

## Installation

First of all, on your instance or droplet; mosquitto broker will need a user named as mosquitto :
```
$ sudo adduser mosquitto
```

Below libraries will be required during broker installation:
```
$ sudo apt-get update
$ sudoapt-get install build-essential libwrap0-dev libssl-dev libc-ares-dev uuid-dev xsltproc cmake unzip
```

For MQTT over Websocket support, we need to install websockets library. Due to necessary fixes, we prefer 2.4.2:
```
$ wget https://github.com/warmcat/libwebsockets/archive/v2.4.2.zip
$ mv v2.4.2.zip libwebsockets-2.4.2.zip
$ unzip libwebsockets-2.4.2.zip
$ cd libwebsockets-2.4.2
$ mkdir build
$ cd build
$ cmake ..
$ make
$ sudo make install
```

Get mosquitto library and unpack:
```
$ cd /home/mosquitto
$ wget http://mosquitto.org/files/source/mosquitto-1.6.2.tar.gz
$ tar xvzf mosquitto-1.6.2.tar.gz
$ cd mosquitto-1.6.2
```

To enable MQTT over Websocket support, modify the config.mk and enable WITH_WEBSOCKETS flag like :
```
WITH_WEBSOCKETS:=yes
```

Build and install the library.
```
$ make
$ sudo make install
```

Sync the libraries after all.
```
$ sudo /sbin/ldconfig
```

## Configuration

Will be completed after authorization task is done. All configuration details, port configuration, authentication of users and authorization to topics wil be covered.

### Configuration File
### Authorization Database
### Users
### Access Control List

## Testing with Clients
You can test up the MQTT connectivity with several methods listed below.

### Websocket Clients
HiveMQ has a proven MQTT WebClient to test your MQTT broker. Below picture has steps to how to test the broker with it:
![Alt text](hivemq_connect.png?raw=true "HiveMQ WebSocket Client")
```
1. First, navigate to [MQTT WebClient Page](http://www.hivemq.com/demos/websocket-client/)
2. Write down the IP address of the instance where broker runs. Currently it is : **159.203.164.3**
3. WebClients use MQTT via WebSockets. Our Websocket port number is **8883**.
4. Client id must be a unique key. Keep what page suggests. 
5. User name is required for MQTT connection. Our test username is : **terasys**
6. Test password is : **terasys123**
7. Simply press to the Connect button.
```
After connection is done, follow below steps:
![Alt text](hivemq_pubsub.png?raw=true "WebSocket Client Pub/Sub")
```
1. Subscribe to the test topic on given button : **teradev/device/99**
2. Type same topic on the Publish topic area to send some data to on topic.
3. Write any message to send.
4. Press Publish button.
5. Received messaged will be listed in the Messages section.
```

### Mosquitto Console Tools
Mosquitto MQTT broker provides some sample binaries to easily publish and subscribe messages to test your broker. Follow up the steps below:
![Alt text](droplet_mqtt_test1.png?raw=true "Console Test")
```
1. Open two terminals and use mosquitto_sub and mosquitto_pub binaries with given parameters. First subscribe and then publish to the subscribed topic.
2. Provide the broker instance IP address with -h parameter : **159.203.164.3**
3. MQTT port will be provided via -p parameter : **1883**. Notice: MQTT over TCP IP is differs from MQTT over Websockets. *Will be covered in Configuration steps.*
4. Provide the topic to be published and subscribed with -t parameter : **teradev/device/100** 
5. User name is required for MQTT connection. Our test username is : **terasys**
6. Test password is : **terasys123**
7. Send any kind of data and will be listed on subscribed terminal.
```

### Device Clients
Will be extended when device task is done.
#### ESP8266 Arduino
#### ESP8266 Micropython
#### ESP32 C SDK
#### Raspberry
