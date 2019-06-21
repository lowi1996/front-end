import time
import json
from car_movement import CarMovement
from sensors import Sensors


try:
	car = CarMovement()
	sensors = Sensors()
	car.set_angle(car.DEFAULT_ANGLE)
	distance = 9999
	while distance > 1 and distance != -1:
		distance = sensors.read_distance()
	car.set_angle(car.MIN_ANGLE)
	time.sleep(1)
	car.set_angle(car.MAX_ANGLE)
	time.sleep(1)
	car.set_angle(car.DEFAULT_ANGLE)
	print(json.dumps({"status": "success", "output": "Ultrasonic Sensor calibrated successfully"}))
except Exception, e:
	print("ERROR:{}".format(e))