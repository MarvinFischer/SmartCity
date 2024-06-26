# SmartCity



# Mobile Interface
Mobile interface code has been added as a seperate folder for the Smart City project. Following guide explains how to configure the MQTT messages which need to integrate with the Raspberry Pi hardware. 

## Getting Started

There are two gauge indicators for Temperature and Humidity levels, chart for CO2 level and a toggle button to switch on/off an attached device to the Raspberry Pi.

Following are the MQTT topics and example messages to communicate with the application.

MQTT broker address need to be added to the file main.dart at Line no 34.
E.g. broker: 'test.mosquitto.org',

1. Temperature widget: topic   => smart_window/temp
                    data    => String number
                    E.g. 25

2. Humidity widget:    topic   => smart_window/humidity
                    data    => String number
                    E.g. 56

3. CO2 chart widget:   topic   => smart_window/o2
                    data    => Date:Time, value
                    E.g. 2024-06-15T12:00:00,450

4. Toggle button widget:   topic   => smart_window/system
                        data    => on / off

