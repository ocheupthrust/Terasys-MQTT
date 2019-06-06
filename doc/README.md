# TerasysHUB IoT Platform - MQTT Implementation
This document highlights how to accomplish broker installation, configuration, running and testing phases.
## Installation
Detailed installation guide for Mosquitto broker and Mosquitto authorization plug-in was provided.
### Broker Installation
* First of all, on your instance or droplet; mosquitto broker will need a user named as mosquitto :
```
$ sudo adduser mosquitto
```
* Below libraries will be required during broker installation:
```
$ sudo apt-get update
$ sudoapt-get install build-essential libwrap0-dev libssl-dev libc-ares-dev uuid-dev xsltproc cmake unzip
```
* For MQTT over Websocket support, we need to install websockets library. Due to [necessary fixes](https://github.com/eclipse/mosquitto/issues/303), we prefer 2.4.2:
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
* Get mosquitto library and unpack:
```
$ cd /home/mosquitto
$ wget http://mosquitto.org/files/source/mosquitto-1.6.2.tar.gz
$ tar xvzf mosquitto-1.6.2.tar.gz
$ cd mosquitto-1.6.2
```
* To enable MQTT over Websocket support, modify the **config.mk** (you can use *nano* editor for quick update) and enable WITH_WEBSOCKETS flag like :
```
WITH_WEBSOCKETS:=yes
```
* Build and install the library:
```
$ make
$ sudo make install
```
* Sync the libraries after all:
```
$ sudo /sbin/ldconfig
```
### Authorization Plug-in Installation
* Get the code for auth plug-in installation:
```
$ git clone https://github.com/jpmens/mosquitto-auth-plug.git
```
* This plug-in codebase has some conflicts with latest 1.6.x Mosquitto library. In 1.6.x some function interfaces were updated. So you will need to apply this patch in plug-in's auth-plug.c file:
```
https://github.com/gabod2000/Terasys-MQTT/blob/master/broker/auth/mosquitto_v162_auth.patch
```
* You can apply this patch manually due to its small size, or after download you can type :
```
$ patch < mosquitto_v162_auth.patch
```
* Like Mosquitto, the plug-in also have a config file, it is **config.mk** resides in the source. It requires the location of the downloaded Mosquitto library source code. Also SSL binary need to be provided. Modify the config.mk :
```
MOSQUITTO_SRC =/home/$USER/mosquitto-1.6.2
OPENSSLDIR = /usr/bin
```
* If you do not have open-ssl installed, use below command:
```
$ sudo apt-get install openssl
```
* Another requirement of the library is MySQL. Need to install these libraries:
```
$ sudo apt-get install mysql-server
$ sudo apt-get install libmysqlclient-dev
```
* During MySQL server installation, you will be requested to give user and password for root user. You can basicly assign like below:
```
user: root
pass: terasys123
```
* All configs looks OK now, so you can compile it :
```
$ cd mosquitto-auth-plug
$ make
```
* After compilation is done, your shared library will be generated in this directory. Copy it to correct destination as we declared in Mosquitto Config file:
```
$ sudo cp auth-plug.so /etc/mosquitto
```
## Configuration
Mosquitto MQTT Broker has several config parameters like port numbers, protocols, log severity etc. which makes you to configure and set every provided feature of the broker.
### Broker Configuration File
Mosquitto MQTT Broker keeps its config in a file and takes them as parameter at service startup. Our configuration file could be found in here :
```
https://github.com/gabod2000/Terasys-MQTT/blob/master/broker/etc/mosquitto/mosquitto.conf
```
* Copy this file under **/etc/mosquitto/mosquitto.conf** :
```
cp mosquitto.conf /etc/mosquitto/mosquitto.conf
```
* Give permission for persistence database of Mosquitto:
```
$ sudo mkdir /var/lib/mosquitto/
$ sudo chown mosquitto:mosquitto /var/lib/mosquitto/ -R
```
* Do not forget to open given ports (1883, 8883) for remote access. In a Digital Ocean droplet do them:
```
$ sudo ufw allow 1883
$ sudo ufw allow 8883
```
* You will see explanations of the config params in comment line. For more info you can check [Mosquitto Conf Man Page](https://mosquitto.org/man/mosquitto-conf-5.html).
NOTICE: Your mosquitto broker service need to be restarted once the configuration file changes to be taken in action.
### Authorization Plug-in Configuration
As you see in the config file, there are several fields for user and topic management. In default, Mosquitto supports files for storing users and topics. **BUT**, they require to reboot mosquitto to refresh user or topic info provided n the file. **SO**, we need to use authorization (Auth) plugin and database to **INSTANTLY** add or remove users and their topic privileges, without reboot or file I/O.
#### Authorization Database
Provided authorization plug-in supports several database technologies to store user and topic data. We prefer MySQL for full feature support and variety of man page. Before heading on, be sure that you have completed **Installation** steps and installed MySQL correctly.
* MySQL will require a database first of anything. In that database, we can create required tables and insert tinto that tables. To accomplish this creation task, there is a script collection for creating required plug-in database and tables. Additionally, it inserts a dummy test user. Here the file is :
```
https://github.com/gabod2000/Terasys-MQTT/blob/master/broker/auth/mysql_generator.sql
```
* This file will automatically create required MySQL objects. Run it with the command below :
```
$ cat mysql_generator.sql | mysql -u root -p
```
* Above command dumps the script into mysql. The param -u defines the user which is **root**. Now it will require the MySQL root password. Type it as we provide in **Installation** steps :
```
terasys123
```
* Now your database and tables are ready. Database name is : **terasysmqttuserdb**
* Additionally a **test user was added via auth plug-in** for MQTT connectivity was added with below credentials :
```
user: terasys@terasys.com
pass: terasys123
```
NOTICE: We will distinguish users bu their unique e-mails that are used to register into the system. User addition will be detailed in below chapters.
* A brief MySQL info; type below command and then password to launch mysql shell :
```
mysql -u root -p
```
* Type below commands in the figure in to MySQL shell to list your created tables in the database :
![Alt text](mysql_show_table.png?raw=true "MySQL Show Tables")
#### Users
Each incoming user will have an MQTT user with the registered e-mail address. 
#### Access Control List and Topics
#### Testing Authorization Plug-in
## Running
* To run mosquitto broker **manually**, type the command below with your config file :
```
$ sudo mosquitto -c /etc/mosquitto/mosquitto.conf > mosquitto.log &
```
* You will get logs to mosquitto.log file where the process will be running in the backgroud by **&** parameter.
* To run it **automatically** as a daemon add a file called **mosquitto.conf** under **/etc/init/** and add below lines into it:
```
description "Mosquitto MQTT broker"
start on runlevel [2345]
stop on runlevel [06]
respawn
exec /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf >> /etc/mosquitto/mosquitto.log
```
* To make broker running on system restart, modify **rc.local** file and insert below lines at the end of it :
```
exec /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf >> /etc/mosquitto/mosquitto.log &
```
## Working with Clients
You can test up the MQTT connectivity with several methods listed below.
### Websocket Clients
HiveMQ has a proven MQTT WebClient to test your MQTT broker. Below picture has steps to how to test the broker with it:
![Alt text](hivemq_connect.png?raw=true "HiveMQ WebSocket Client")
```
1. First, navigate to [MQTT WebClient Page](http://www.hivemq.com/demos/websocket-client/)
2. Write down the IP address of the instance where broker runs. Currently it is : 159.203.164.3
3. WebClients use MQTT via WebSockets. Our Websocket port number is : 8883.
4. Client id must be a unique key. Keep what page suggests. 
5. User name is required for MQTT connection. Our test username is : terasys
6. Test password is : terasys123
7. Simply press to the Connect button.
```
After connection is done, follow below steps:
![Alt text](hivemq_pubsub.png?raw=true "WebSocket Client Pub/Sub")
```
1. Subscribe to the test topic on given button : teradev/device/99
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
2. Provide the broker instance IP address with -h parameter : 159.203.164.3
3. MQTT port will be provided via -p parameter : 1883
REMINDER: MQTT over TCP IP is differs from MQTT over Websockets.
4. Provide the topic to be published and subscribed with -t parameter : teradev/device/100
5. User name is required for MQTT connection. Our test username is : terasys
6. Test password is : terasys123
7. Send any kind of data and will be listed on subscribed terminal.
```
### Device Clients
Supported embedded device clients with different SDKs will be described in here.
#### ESP8266 Arduino
#### ESP8266 Micropython
#### ESP32 C SDK
#### Raspberry

