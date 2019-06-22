## Client Connection Guide for Linux based (Raspberry, BeagleBone, Ubuntu etc.) systems

This sample will show you how to connect, send and receive data via terasyshub.

Before proceeding, be sure that you have installed right image into your Raspberry device. Please follow up [instructions](https://www.raspberrypi.org/documentation/installation/installing-images/) if you haven't done it yet.

* Raspberry and BeagleBone users need to get their IP address to establish an SSH connection to access to the shell. You can connect your device to a TV via HDMI to get it under *Network Settings*. For detailed SSH info, check this [link](https://www.raspberrypi.org/documentation/remote-access/ssh/). Once you are ready with your shell, you can proceed.
* Be sure that you have the git client to get our sample code and required libraries :
```
$ sudo apt-get install git
```
* Clone required MQTT client library into your system and type following commands to install it :
```
$ git clone https://github.com/eclipse/paho.mqtt.c.git
$ cd paho.mqtt.c.git
$ make
$ sudo make install
```
* Your system may need to have OpenSSL and Curl libraries. If necessary type these commands in your shell :
```
$ sudo apt-get install libssl-dev
$ sudo apt-get install libcurl4-openssl-dev
```
* Now you are ready to get the sample code :
```
$ git clone https://github.com/gabod2000/Terasys-MQTT.git
$ cd client/raspberry_linux
```
* After getting the code, you will need to change the initial credentials with yours. Navigate to **mqtt.h** file and change below fields :
```
#define MQTT_CLIENT_ID      "YOUR_UNIQUE_CLIENT_ID_OR_MAC"
#define MQTT_USERNAME       "YOUR_MQTT_USER"
#define MQTT_PASSWORD       "YOUR_MQTT_PASSWORD"
#define MQTT_TOPIC          "YOUR_MQTT_TOPIC"
```
* Notice that, above infomations are provided in your terasyshub dashboard except **MQTT_CLIENT_ID**. Please assign a random and unique id for each of your clients, i.e. use your MAC address or just assign date-time info of the current moment.
* After modifications, code compilation need to be done. Basically type :
```
$ make
```
* After successful compilation you will get the execuable file called **terasysmqttcli** under same directory. Run it :
```
$ ./terasysmqttcli
```
* The running program will subscribe to your given topic. For every 3 seconds, it will publish a test message and you will receive it in your shell due to subscription in the sample. The logs will demonstrate the running process :
```
Initializing MQTT...
Subscribing to topic terasys@terasys.com/device/1 for client xx:xx:xx:xx:xx using QoS1

Press Ctrl+C to quit.

Message arrived
  topic: terasys@terasys.com/device/1
  message: terasys test

Message arrived
  topic: terasys@terasys.com/device/1
  message: terasys test

...
```
