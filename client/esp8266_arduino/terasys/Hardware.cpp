#include "Hardware.h"
#include "Global.h"

const uint8_t hw_delay = 10;

void SerialInit()
{
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.setDebugOutput(true);
  delay(hw_delay);
}

void GPIOInit()
{
  /* Not implemented yet. */
}

void HWInit()
{
  SerialInit();
  GPIOInit();
}

void HWRestart()
{
  ESP.restart();
}

