
function HTML_connectionEstablished(uuid)
{
    var user = $("#userText").val();
    var maqiattoTopics = false;
    if ($("#brokerText").val() == "maqiatto.com")
        maqiattoTopics = true;
    $("#connectionDiv").html("Connected to MQTT Broker.<br>Client ID : " + uuid);
    $('#subpubDiv').removeClass("hidden");
    $('#messageDiv').removeClass("hidden");
    if (maqiattoTopics) {
        $('#subText').val(user + "/");
        $('#pubTopicText').val(user + "/");
    }
}

function HTML_showIncomingMessage(payload, topic)
{
    $("#messageDiv").append("<br/><b>[" + dateGatherer() + "] </b>Received message : " + payload + ", Topic : " + topic);
}

function HTML_showSubscriptionStatus(topic)
{
    $("#messageDiv").append("<br/><b>[" + dateGatherer() + "] </b>Subscribed to : " + topic);
}

function dateGatherer()
{
    var d = new Date();
    var formatted = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate() + " " +
                    d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
    return formatted;
}

$('#subButton').click(function(){
    MQTT_Subscribe($("#subText").val());
});

$('#pubButton').click(function(){
    MQTT_Publish($("#pubTopicText").val(), $("#pubMessageText").val());
});

$('#connButton').click(function(){
    MQTT_Connect($("#userText").val(), $("#passText").val());
});