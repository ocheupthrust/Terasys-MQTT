## A. Installation

0. Steps below will be applied on Droplet or any instance that is target computer. <br />
So need SSH connection first, use the command below :<br />
$ ssh root@DROPLET_IP<br />
Now you are on the Droplet's shell.<br />

1. On your instance or droplet; mosquitto broker will need a user named as mosquitto :<br />
$ sudo adduser mosquitto<br />

2. Below libraries are default for mosquitto: <br />
$ sudo apt-get update<br />
$ sudoapt-get install build-essential libwrap0-dev libssl-dev libc-ares-dev uuid-dev xsltproc cmake unzip<br /> 

3. For MQTT over Websocket support, install the websockets library:<br />
$ wget https://github.com/warmcat/libwebsockets/archive/v2.4.2.zip
$ mv v2.4.2.zip libwebsockets-2.4.2.zip
$ unzip libwebsockets-2.4.2.zip
$ cd libwebsockets-2.4.2
$ mkdir build
$ cd build
$ cmake ..
$ make
$ sudo make install

4. Get mosquitto library and unpack:<br />
$ cd /home/mosquitto<br />
$ wget http://mosquitto.org/files/source/mosquitto-1.6.2.tar.gz<br />
$ tar xvzf mosquitto-1.6.2.tar.gz<br />
$ cd mosquitto-1.6.2<br />

5. To enable MQTT over Websocket support, modify the config.mk and enable WITH_WEBSOCKETS flag like :<br />
WITH_WEBSOCKETS:=yes<br />

6. Build and install the library.<br />
$ make<br />
$ sudo make install<br />

7. Sync the libs.<br />
$ sudo /sbin/ldconfig<br />


## B. Configuration

1. Adding user by creating password file.<br />
$ sudo mosquitto_passwd -c /etc/mosquitto/pwfile terasys<br />

2. For more users, use below command without -c parameter to not override the password file:<br />
$ sudo mosquitto_passwd /etc/mosquitto/pwfile terasys2<br />

3. You will be able to see user list and hashed passwords like below :<br />
$ cat /etc/mosquitto/pwfile<br />

4. Create ACL (Access control list) file :<br />
$ sudo cp /etc/mosquitto/aclfile.example /etc/mosquitto/aclfile<br />

5. Configure ACL by adding your users with privileged topics. By using vi or nano editor, add the lines below to the ACL file :<br />
user terasys<br />
topic teradev/#<br />
user terasys2<br />
topic teradev2/#<br />

6. Add database destination for mosquitto :<br />
$ sudo mkdir /var/lib/mosquitto/<br />
$ sudo chown mosquitto:mosquitto /var/lib/mosquitto/ -R<br />

7. Create mosquitto configuration file :<br />
$ sudo cp /etc/mosquitto/mosquitto.conf.example /etc/mosquitto/mosquitto.conf<br />

8. Need to bind configuration files and settings by adding the lines to the mosquitto.conf :<br />
listener 1883<br />
listener 8883<br />
protocol websockets<br />
persistence true<br />
persistence_location /var/lib/mosquitto/<br />
persistence_file mosquitto.db<br />
log_dest syslog<br />
log_dest stdout<br />
log_dest topic<br />
log_type error<br />
log_type warning<br />
log_type notice<br />
log_type information<br />
connection_messages true<br />
log_timestamp true<br />
allow_anonymous true<br />
password_file /etc/mosquitto/pwfile<br />
acl_file /etc/mosquitto/aclfile<br />

9. For more info about ACL and Configuration parameters, see below sections.<br />
10. For DigitalOcean, we will need to allow MQTT ports by typing :<br />
$ sudo ufw allow 1883<br />
$ sudo ufw allow 8883<br />

## C. ACL and User Configuration

About ACL;<br />

1. ACL denotes which user can access to the given specific topic. <br />
$ is wildcard and terasys user can access any topic begins with teradev/...<br />

2. After each user was added to the password file, mosquitto requires reboot. <br />
To avoid reboot and add users dynamically to an database, you can use the library below :<br />
https://github.com/jpmens/mosquitto-auth-plug<br />

About configuration;<br />

1. listener parameter denotes which port will be used for MQTT connection.
2. The second listener definition denotes the websocket supported MQTT connection port when the protocol parameter denotes websocket.
3. As we defined websocket support from config.mk, we will be able to support that feature.
4. persistance_* lines denotes a database space where mqtt broker use.
5. allow_anonymous will make anonymous connection accepted. It would be beneficial for gathering some stats from broker. Check test step below for more info.
6. password_file denotes the password file path that we created.
7. acl_file denotes the access control list file path that we created.


## D. Running

1. To run mosquitto broker, type the command below with your config file :
$ sudo mosquitto -c /etc/mosquitto/mosquitto.conf > mosquitto.log &<br />
2. You will get logs to mosquitto.log file.<br />
3. Process will be daemonized by & parameter.<br />
4. For future use, some daemonizing would be added :<br />
nano /etc/init/mosquitto.conf<br />
5. Add below lines into it :<br />
description "Mosquitto MQTT broker"<br />
start on runlevel [2345]<br />
stop on runlevel [06]<br />
respawn<br />
exec /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf >> /etc/mosquitto/mosquitto.log<br />
6. To make broker running on system restart, modify this file :<br />
$ nano /etc/rc.local<br />
7. Add the following line to the above file re-spawn on restart :<br />
exec /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf >> /etc/mosquitto/mosquitto.log &<br />


## E. Testing

1. There will be some executables comes after mosquitto installation to help mqtt publish and subscribe.
2. First, lets subscribe to a topic anonymously :
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/uptime'<br />

3. This subscribtion will receive data from broker about broker's uptime. There are also other options to see the broker stats like below :

$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/messages/received'<br />
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/messages/sent'<br />
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/bytes/#'<br />
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/clients/total'<br /><br />

4. Subscribing to a topic that needs authentication would also be done with :
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t 'teradev/device/100' -u terasys -P terasys123<br />

5. With openning another termianl and connecting to your droplet, we will be able to test mosquitto's publish fuatures :
$ mosquitto_pub -h 159.203.164.3 -p 1883 -t 'teradev/device/100' -u terasys -P terasys123 -m 'lights:on'<br />


