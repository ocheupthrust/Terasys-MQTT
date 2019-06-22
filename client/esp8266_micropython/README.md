## Client Connection Guide for ESP devices with Micropython
Micropython is getting popular on resource constrained embedded devices day by day. Terasys provide micropython code sample for resource constrained devices like ESP826 and ESP32.
Below you can find the steps to make sample run on your device.
### Getting ready for Micropython
* There are several ways to run and burn micropython on your devices. It is preferred to use **uPyCraft** IDE to accomplish this task.
* Follow up [this link](https://randomnerdtutorials.com/getting-started-micropython-esp32-esp8266/) to make your environment ready for the **python** development and running **uPyCraft**.
* As the previous link suggests, get the latest firmware from the [given link](https://randomnerdtutorials.com/flash-upload-micropython-firmware-esp32-esp8266/) and follow up the instructions in the IDE.
### Running Micropython MQTT sample on ESP Devices
* Download the micropython code base from [this](https://github.com/gabod2000/Terasys-MQTT/tree/master/client/esp8266_micropython) repository and put all python codes under your **uPyCraft workspace** directory.
* From the IDE menu, do **File->Flush Directory**. Your files will be visible in the IDE.
* Update below credentials under **boot.py** file :
```
# Update below credentials with yours
ssid = 'YOUR_WIFI_SSID'
password = 'YOUR_WIFI_PASSWORD'
mqtt_user = 'YOUR_MQTT_USER'
mqtt_pass = 'YOUR_MQTT_PASS'
topic_sub = b'YOUR_TEST_TOPIC'
topic_pub = b'YOUR_TEST_TOPIC_AGAIN'
```
* Connect your device to PC via USB and select correct port via **Tools->Serial**.
* Press **F5** or **Tools->Donload and Run**. 
* Reboot your device and you will see below logs whih means everything is OK : 
```
exec(open('./boot.py').read(),globals())
Connection successful
('192.168.1.101', '255.255.255.0', '192.168.1.1', '192.168.1.1')
Connected to www.terasyshub.io MQTT broker, subscribed to b'terasys@terasys.com/sensor' topic
(b'terasys@terasys.com/sensor', b'terasys test msg #0')
(b'terasys@terasys.com/sensor', b'terasys test msg #1')
(b'terasys@terasys.com/sensor', b'terasys test msg #2')
```