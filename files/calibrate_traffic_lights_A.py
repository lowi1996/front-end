import serial
import json


try:
    arduino1 = serial.Serial('/dev/ttyACM0', 9600)
    arduino2 = serial.Serial('/dev/ttyACM1', 9600)
    arduino1.write("calibration".encode())
    arduino2.write("calibration".encode())
    print(json.dumps({"message" : "Traffic lights calibrated successfully"}))
except Exception as e:
    print("ERROR:{}".format(e))
