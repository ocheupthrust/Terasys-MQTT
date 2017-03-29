#include <Arduino.h>

#include "Hardware.h"
#include "WiFiCore.h"
#include "MQTTConnector.h"
#include "Global.h"
#include "Credentials.h"

void setup()
{
  HWInit();
  WiFiBegin(STA_SSID, STA_PASS);
  MQTTBegin();
}

void loop()
{
  MQTTLoop();
}
