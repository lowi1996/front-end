import time
from car_movement import CarMovement


try:
    car = CarMovement()
    angle = car.DEFAULT_ANGLE
    car.set_angle(angle)
    time.sleep(1)
    while angle > car.MIN_ANGLE:
        angle -= 5
        car.set_angle(angle)
        time.sleep(0.1)
    car.set_angle(car.DEFAULT_ANGLE)
    angle = car.get_angle()
    while angle < car.MAX_ANGLE:
        angle += 5
        car.set_angle(angle)
        time.sleep(0.1)
    car.set_angle(car.DEFAULT_ANGLE)
    time.sleep(3)
    car.set_speed(50)
    time.sleep(2)
    car.set_speed(-50)
    time.sleep(2)
    car.set_speed(0)
    print(json.dumps({"status": "success", "output": "Car wheels and motor calibrated successfully"}))
except Exception, e:
    print("ERROR:{}".format(e))