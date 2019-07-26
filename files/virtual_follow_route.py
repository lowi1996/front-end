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


CAR = {
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
    frontend.recognizeAgent(CAR)
    return frontend

def can_move(tag):
    msg = "setAgentPosition_{}_{}".format(CAR["id"], tag)
    s_traffic.send(msg.encode())
    response = s_tf_light.recv(512).decode()
    if response == "free":
        return True
    else:
        return False

def read_RFID():
    request_ip = subprocess.getoutput("hostname -I | awk '{print $1}'")
    route = params.get("route_rfid")
    route = route.split("@")
    start = ""
    for tag in route:
        if tag in card_ids.keys():

            while not can_move(card_ids[tag]):
                time.sleep(0.5)

            frontend.repositionAgent(CAR["id"], card_ids[tag])
            time.sleep(0.5)
            if tag in trafficlight_positions.keys():
                s_tf_light.send("requestTrafficLightStatus_{}".format(trafficlight_positions[tag]).encode())
                color = s_tf_light.recv(1024).decode()
                color = color.split("_")[1]
                while color == "red" or color == "yellow":
                    s_tf_light.send("requestTrafficLightStatus_{}".format(trafficlight_positions[tag]).encode())
                    time.sleep(0.5)
                    color = s_tf_light.recv(1024).decode()
                    color = color.split("_")[1]
                    print("Color:", color)
                print("Color: ", color)
                time.sleep(0.5)
                start = tag
    new_request = {
        "service_id" : "VIRTUAL_FOLLOW_ROUTE",
        "params": {
            "Inicio": card_ids[start],
            "Final": "",
            "host_frontend": HOST_FRONTEND,
            "port_frontend": PORT_FRONTEND,
            "agent_id": agent_id
        }
    }
    requests.post("http://{}:8000/request_service".format(request_ip), json=new_request)

def get_route(my_ip, agent_id, params):
    response = requests.post(
        "http://{}:8000/request_service".format(my_ip),
        json={"service_id": "SHORTEST_ROUTE", "agent_id": agent_id, "params": params}
    )
    # print("Response: {}".format(response.text))
    route = json.loads(json.loads(response.text).get("output"))
    for key, value in params.items():
        if key not in route.keys():
            route[key] = params[key]
    return route



if __name__ =="__main__":
    #try:
    params = get_params(sys.argv)
    HOST_FRONTEND = params.get("host_frontend")
    PORT_FRONTEND = int(params.get("port_frontend"))
    tf_light_ip = params.get("GESTION_SEMAFOROS_ip")
    tf_light_port = int(params.get("GESTION_SEMAFOROS_port"))
    traffic_ip = params.get("GESTION_TRAFICO_ip")
    traffic_port = int(params.get("GESTION_TRAFICO_port"))
    agent_id = params["agent_id"]
    CAR["id"] = agent_id
    frontend = connect_frontend()
    s_tf_light = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    s_traffic = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    s_tf_light.connect((tf_light_ip, tf_light_port))
    s_traffic.connect((traffic_ip, traffic_port))
    s_tf_light.send("card_id_request".encode())
    card_ids = s_tf_light.recv(5096)
    card_ids = json.loads(card_ids.decode())
    s_tf_light.send("traffic_light_request".encode())
    trafficlight_positions = s_tf_light.recv(5096)
    trafficlight_positions = json.loads(trafficlight_positions.decode())
    print(trafficlight_positions)

    while True:
        params["Inicio"] = params["Final"]
        del params["Final"]
        next_params = get_route(my_ip, agent_id, params)
        read_RFID()
        params = next_params

   # except Exception as e:
   #print(e)
#        print("ERROR:{}".format(e))
