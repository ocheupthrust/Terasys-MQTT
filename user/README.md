## TerasysHUB  MQTT Web Page App
This web app provides MQTT connectivity via browser to send and receive MQTT messages instantly.  
You will provide your TerasysHUB credentials to connect to the Broker.  
This app was powered by pure HTML, JavaScript and adaptive CSS.  
### Run the Web App
* Basically, download all items under TeraSysHub repository via git :
```
$ git clone https://github.com/gabod2000/Terasys-MQTT.git
```
* Or, just download as zip from the (donwload button)[https://github.com/gabod2000/Terasys-MQTT] in the GitHub.
* Navigate into **user** directory in gathered TeraSysHubrepository :
```
$ cd Terasys-MQTT/user
```
* Open **index.html** page with your favorite browser. 
* It will include all required JavaScript libraries automatically.
### How to Use It
* First, provide your TerasysHUB username and password into the given fields like below :
![Alt text](img/userpage.png?raw=true "Connect page")
* You can use test user credentials :
```
username : terasys@terasys.com
password : terasys123
```
* Once the connection succeeded, you will need to provide your topic to send and receive messages :
![Alt text](img/pubsub.png?raw=true "Connect page")
* As you see in the figure, there is a textbox to subscribe and publish to the topics.
* First type your topic (1) and press subscribe (2) button. You will see the subscription event message (2) on the bottom of the page when it is done. 
* Provide same topic to publish field with a message (3) to send the data over the broker and receive it in your web app.
* Press publish (4) button and you will see the incoming message (4) on the bottom side.
* You can open more browsers to make your tests extended.
