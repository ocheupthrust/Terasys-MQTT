var mqttClient = null;
var uniqeUserId = null;

function onMQTTConnect()
{
    HTML_connectionEstablished(uniqeUserId);
}

function onMQTTFail(responseObject)
{
    alert("Connection/Credential Failure: " + responseObject.errorMessage);
}

function onMQTTConnectionLost(responseObject)
{
    if (responseObject.errorCode !== 0)
    {
        alert("Connection Lost: " + responseObject.errorMessage);
    }
}

function onMQTTMessageArrived(message)
{
    HTML_showIncomingMessage(message.payloadString, message.destinationName);
}

function MQTT_Connect(user, pass)
{
    var broker = "www.terasyshub.io";
    var port = 8883;
    /* Other brokers may have accept anonymous connections, so do not check pass sanity. */
    if(user !== "")
    {
        uniqeUserId = TOOL_GenerateUUID();
        mqttClient = new Paho.MQTT.Client(broker, Number(port), uniqeUserId);
        mqttClient.onConnectionLost = onMQTTConnectionLost;
        mqttClient.onMessageArrived = onMQTTMessageArrived;

        mqttOptions = {
            onSuccess : onMQTTConnect,
            onFailure : onMQTTFail,
            userName : user,
            password : pass
        };

        mqttClient.connect(mqttOptions);
    }
    else
    {
        alert("Please provide broker credentials.");
    }

    return mqttClient;
}

function MQTT_Subscribe(topic)
{
    if(mqttClient)
    {
        var subOptions = {
            onSuccess : function(subResponse) {
                HTML_showSubscriptionStatus(topic);
              },
            onFailure : function(subResponse) {
                alert("Topic Subscription Failure.");
              },
            timeout : 3
        }
        mqttClient.subscribe(topic, subOptions);
    }
}

function MQTT_Publish(topic, payload)
{
    var message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    mqttClient.send(message);
}