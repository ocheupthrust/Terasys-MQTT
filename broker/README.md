#A. Installation

0. Steps below will be applied on Droplet or any instance that is target computer. 
So need SSH connection first, use the command below :
$ ssh root@DROPLET_IP
Now you are on the Droplet's shell.
1. On your instance or droplet; mosquitto broker will need a user named as mosquitto :
$ sudo adduser mosquitto
2. Below libraries are default for mosquitto: 
$ sudo apt-get update
$ sudoapt-get install build-essential libwrap0-dev libssl-dev libc-ares-dev uuid-dev xsltproc 
3. For MQTT over Websocket support, install the websockets library:
$ sudo apt-get install libwebsockets-dev
4. Get mosquitto library and unpack:
$ cd /home/mosquitto
$ wget http://mosquitto.org/files/source/mosquitto-1.4.8.tar.gz
$ tar xvzf mosquitto-1.4.8.tar.gz
$ cd mosquitto-1.4.8
5. To enable MQTT over Websocket support, modify the config.mk and enable WITH_WEBSOCKETS flag like :
WITH_WEBSOCKETS:=yes
6. Build and install the library.
$ make
$ sudo make install
7. Sync the libs.
$ sudo /sbin/ldconfig


#B. Configuration

1. Adding user by creating password file.
$ sudo mosquitto_passwd -c /etc/mosquitto/pwfile terasys
2. For more users, use below command without -c parameter to not override the password file:
$ sudo mosquitto_passwd /etc/mosquitto/pwfile terasys2
3. You will be able to see user list and hashed passwords like below :
$ cat /etc/mosquitto/pwfile
4. Create ACL (Access control list) file :
$ sudo cp /etc/mosquitto/aclfile.example /etc/mosquitto/aclfile
5. Configure ACL by adding your users with privileged topics. By using vi or nano editor, add the lines below to the ACL file :
user terasys
topic teradev/#

user terasys2
topic teradev2/#
6. Add database destination for mosquitto :
$ sudo mkdir /var/lib/mosquitto/
$ sudo chown mosquitto:mosquitto /var/lib/mosquitto/ -R
7. Create mosquitto configuration file :
$ sudo cp /etc/mosquitto/mosquitto.conf.example /etc/mosquitto/mosquitto.conf
8. Need to bind configuration files and settings by adding the lines to the mosquitto.conf :
listener 1883
listener 8883
protocol websockets
persistence true
persistence_location /var/lib/mosquitto/
persistence_file mosquitto.db
log_dest syslog
log_dest stdout
log_dest topic
log_type error
log_type warning
log_type notice
log_type information
connection_messages true
log_timestamp true
allow_anonymous true
password_file /etc/mosquitto/pwfile
acl_file /etc/mosquitto/aclfile
9. For more info about ACL and Configuration parameters, see below.
10. For DigitalOcean, we will need to allow MQTT ports by typing :
$ sudo ufw allow 1883
$ sudo ufw allow 8883

#C. ACL and User Configuration

ACL denotes which user can access to the given specific topic. 
$ is wildcard and terasys user can access any topic begins with teradev/...
After each user was added to the password file, mosquitto requires reboot. 
To avoid reboot and add users dynamically to an database, you can use the library below :
https://github.com/jpmens/mosquitto-auth-plug

About configuration;
1. listener parameter denotes which port will be used for MQTT connection.
2. The second listener definition denotes the websocket supported MQTT connection port when the protocol parameter denotes websocket.
3. As we defined websocket support from config.mk, we will be able to support that feature.
4. persistance_* lines denotes a database space where mqtt broker use.
5. allow_anonymous will make anonymous connection accepted. It would be beneficial for gathering some stats from broker. Check test step below for more info.
6. password_file denotes the password file path that we created.
7. acl_file denotes the access control list file path that we created.


#D. Running

1. To run mosquitto broker, type the command below with your config file :
$ sudo mosquitto -c /etc/mosquitto/mosquitto.conf > mosquitto.log &
2. You will get logs to mosquitto.log file.
3. Process will be daemonized by & parameter.
4. For future use, some daemonizing would be added :
nano /etc/init/mosquitto.conf
5. Add below lines into it :
description "Mosquitto MQTT broker"
start on runlevel [2345]
stop on runlevel [06]
respawn
exec /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf >> /etc/mosquitto/mosquitto.log
6. To make broker running on system restart, modify this file :
$ nano /etc/rc.local
7. Add the following line to the above file re-spawn on restart :
exec /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf >> /etc/mosquitto/mosquitto.log &

#E. Testing

1. There will be some executables comes after mosquitto installation to help mqtt publish and subscribe.
2. First, lets subscribe to a topic anonymously :

$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/uptime'
3. This subscribtion will receive data from broker about broker's uptime. There are also other options to see the broker stats like below :

$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/messages/received'
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/messages/sent'
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/bytes/#'
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t '$SYS/broker/clients/total'
4. Subscribing to a topic that needs authentication would also be done with :
$ mosquitto_sub -h 159.203.164.3 -p 1883 -v -t 'teradev/device/100' -u terasys -P terasys123
5. With openning another termianl and connecting to your droplet, we will be able to test mosquitto's publish fuatures :
$ mosquitto_pub -h 159.203.164.3 -p 1883 -t 'teradev/device/100' -u terasys -P terasys123 -m 'lights:on'




