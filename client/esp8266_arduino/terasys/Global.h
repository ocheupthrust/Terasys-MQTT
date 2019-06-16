#ifndef ARDUINO_GLOBAL_H
#define ARDUINO_GLOBAL_H

#define Printf            Serial.printf
#define SERIAL_BAUD_RATE  9600

/* Buffer sizes */
#define LEN_IP_MAX          17 
#define LEN_SSID_MAX        32 
#define LEN_PASSPHRASE_MAX  64

/* GPIO Definitions */
static const uint8_t pinMap[11] = {16, 5, 4, 0, 2, 14, 12, 13, 15, 3, 1};

#endif /* ARDUINO_GLOBAL_H */
