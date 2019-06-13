import sys
import socket
from multiprocessing import Queue
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
    frontend.recognizeAgent(FIRETRUCK)
    return frontend

if __name__ == "__main__":
    params = get_params(sys.argv)
    host_frontend = params["host_frontend"]
    port_frontend = params["port_frontend"]
    agent_id = params["agent_id"]
    CAR["id"] = agent_id

    frontend = connect_frontend()
    q = Queue()
    car = CarMovement()
    sensors = Sensors(q)
    line_follower = LineFollower(car, q)
    decision_maker = DecisionMaker(car, sensors, line_follower, frontend, params, CAR, q)
    decision_maker.start()