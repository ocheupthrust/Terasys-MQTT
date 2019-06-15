#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "mqtt.h"

#define TIMEOUT_TO_PUBLISH 3

int main(int argc, char* argv[])
{
    MQTTBegin();

    /* Subscribing to your MQTT topic. */
    MQTTSubscribe(MQTT_TOPIC);

    printf("\nPress Ctrl+C to quit.\n\n");

    while (1)
    {
        /* Publishing periodically to your MQTT topic. */
        MQTTPublish(MQTT_TOPIC, "terasys test");
        sleep(TIMEOUT_TO_PUBLISH);
    }

    /* TODO: Handle graceful exit case. */
    MQTTDisconnect();

    return 0;
}
