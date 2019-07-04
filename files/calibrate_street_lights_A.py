import serial
import json


try:
    arduino = serial.Serial('/dev/ttyACM2', 9600)
    arduino.write("calibration".encode())
    print(json.dumps({"message" : "Street lights calibrated successfully"}))
except Exception as e:
    print("ERROR:{}".format(e))
