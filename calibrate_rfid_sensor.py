import time
import json
from car_movement import CarMovement
from sensors import Sensors


try:
	car = CarMovement()
	sensors = Sensors()
	car.set_angle(car.DEFAULT_ANGLE)
    rfid = sensors.read_RFID()
    print(json.dumps({"status": "success", "output": "RFID sensor calibrated successfully: {}".format(rfid)}))
except Exception, e:
	print("ERROR:{}".format(e))
