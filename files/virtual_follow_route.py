import random
import time
import uuid
import requests
import sys
import subprocess
import json
import socket
from frontend_connection import FrontendConnection
from util import get_params


FIRETRUCK = {
    "type": "car",
    "positioning": "rfid",
    "description": "Vehiculo",
    "position": "",
    "info": {
        "color": "#ffffff"
    }
}

def connect_frontend():
    frontend = FrontendConnection(HOST_FRONTEND, PORT_FRONTEND)
    frontend.recognizeAgent(FIRETRUCK)
    return frontend

def read_RFID():
    request_ip = subprocess.getoutput("hostname -I | awk '{print $1}'")
    route = params.get("route_rfid")
    route = route.split("@")
    start = ""
    for tag in route:
        if tag in card_ids.keys():
            frontend.repositionAgent(FIRETRUCK["id"], card_ids[tag])
            time.sleep(0.5)
            if tag in trafficlight_positions.keys():
                s.send("requestTrafficLightStatus_{}".format(trafficlight_positions[tag]).encode())
                color = s.recv(1024).decode()
                color = color.split("_")[1]
                while color == "red" or color == "yellow":
                    s.send("requestTrafficLightStatus_{}".format(trafficlight_positions[tag]).encode())
                    time.sleep(0.5)
                    color = s.recv(1024).decode()
                    color = color.split("_")[1]
                    print("Color:", color)
                print("Color: ", color)
            time.sleep(0.5)
            start = tag
    new_request = {
        "service_id" : "FOLLOW_ROUTE",
        "params": {
            "Inicio": card_ids[start],
            "Final": "",
            "host_frontend": HOST_FRONTEND,
            "port_frontend": PORT_FRONTEND,
            "agent_id": agent_id
        }
    }
    requests.post("http://{}:8000/request_service".format(request_ip), json=new_request)

if __name__ =="__main__":
    #try:
    params = get_params(sys.argv)
    HOST_FRONTEND = params.get("host_frontend")
    PORT_FRONTEND = int(params.get("port_frontend"))
    socket_ip = params.get("VIRTUAL_FOLLOW_ROUTE_ip")
    socket_port = int(params.get("VIRTUAL_FOLLOW_ROUTE_port"))
    agent_id = params["agent_id"]
    FIRETRUCK["id"] = agent_id
    frontend = connect_frontend()
    s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    s.connect((socket_ip, socket_port))
    s.send("card_id_request".encode())
    card_ids = s.recv(5096)
    card_ids = json.loads(card_ids.decode())
    s.send("traffic_light_request".encode())
    trafficlight_positions = s.recv(5096)
    trafficlight_positions = json.loads(trafficlight_positions.decode())
    print(trafficlight_positions)
    read_RFID()
   # except Exception as e:
   #print(e)
#        print("ERROR:{}".format(e))
