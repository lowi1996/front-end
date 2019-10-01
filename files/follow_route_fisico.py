import sys
import socket
from multiprocessing import Queue, Process
from multiprocessing.managers import BaseManager
from sensors import Sensors
from car_movement import CarMovement
from line_follower import LineFollower
from decision_maker import DecisionMaker
from frontend_connection import FrontendConnection
from util import get_params


CAR = {
    "type" : "car",
    "positioning" : "rfid",
    "description" : "Vehiculo",
    "position" : "",
    "info" : {
        "color" : "#ffffff"
    }
}


def connect_frontend():
    frontend = FrontendConnection(HOST_FRONTEND, PORT_FRONTEND)
    frontend.recognizeAgent(CAR)
    return frontend

def take_decision(rfid_queue, distance_queue):
    decision_maker.start(rfid_queue, distance_queue)

def read_RFID(rfid_queue, sensors, frontend):
    while True:
        tag = sensors.read_RFID()
        rfid_queue.put("rfid-" + tag)

def read_distance(distance_queue, sensors):
    while True:
        distance = sensors.read_distance()
        distance_queue.put("distance-" + str(distance))

def line_follower_process(car, sensors):
    line = LineFollower(car, sensors)
    line.follow_line()


if __name__ == "__main__":
    try:
        params = get_params(sys.argv)
        HOST_FRONTEND = params["host_frontend"]
        PORT_FRONTEND = params["port_frontend"]
        agent_id = params["agent_id"]
        CAR["id"] = agent_id
        emergency = True if params.get("emergency") else False

        frontend = connect_frontend()

        rfid_queue = Queue()
        distance_queue = Queue()

        BaseManager.register('CarMovement', CarMovement)
        manager = BaseManager()
        manager.start()
        sensors = Sensors()
        car = manager.CarMovement()
        decision_maker = DecisionMaker(car, params, CAR, frontend, rfid_queue, distance_queue, emergency)
        rfid_process = Process(target=read_RFID, args=(rfid_queue, sensors, frontend,))
        distance_process = Process(target=read_distance, args=(distance_queue, sensors,))
        decision_process = Process(target=take_decision, args=(rfid_queue, distance_queue,))
        line_process = Process(target=line_follower_process, args=(car, sensors,))

        decision_process.start()
        rfid_process.start()
        distance_process.start()
        line_process.start()
        decision_process.join()

        decision_process.terminate()
        rfid_process.terminate()
        distance_process.terminate()
        line_process.terminate()

    except Exception, e:
        print("ERROR:{}".format(e))
