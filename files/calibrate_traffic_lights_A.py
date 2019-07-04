import serial
import json


try:
    arduino1 = serial.Serial('/dev/arduinos/tw', 9600)
    arduino2 = serial.Serial('/dev/arduinos/ts', 9600)
    arduino1.write("calibration".encode())
    arduino2.write("calibration".encode())
    print(json.dumps({"message" : "Traffic lights calibrated successfully"}))
except Exception as e:
    print("ERROR:{}".format(e))
