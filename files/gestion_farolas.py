import time
import sys
import json
import socket
import sqlite3
import errno
import serial
from threading import Thread
from util import get_params
from frontend_connection import FrontendConnection


TRAFFIC_LIGHT_REQUEST = "traffic_light_request"
CARD_ID_REQUEST = "card_id_request"
NESTED_LEADERS_REQUEST = "nested_leaders_request"
EMERGENCY_DICT_REQUEST = "emergency_dict_request"
REQUEST_TRAFFIC_LIGHT_STATUS = "requestTrafficLightStatus"
SET_TRAFFIC_LIGHT_COLOR = "setTrafficLightColor"
RESPONSE_TRAFFIC_LIGHT_COLOR = "responseTrafficLightColor"


# Propiedades y caracteristicas de los agentes que representa este script
f1 = {
    "id" : "F1",
    "type" : "streetlight",
    "positioning" : "rfid",
    "x" : 315,
    "y" : 818,
    "status" : 0,
    "description" : "Farola",
    "attributtes" : {
        "role" : "agent",
        "leader" : "F4",
        "resources" : {
            "CPU" : "1GHz",
            "Chipset" : "DDR4",
            "DISK" : 50
        },
        "iots" : {}
    }
}

f2 = {
    "id" : "F2",
    "type" : "streetlight",
    "positioning" : "rfid",
    "x" : 433,
    "y" : 818,
    "status" : 0,
    "description" : "Farola",
    "attributtes" : {
        "role" : "agent",
        "leader" : "F4",
        "resources" : {
            "CPU" : "1GHz",
            "Chipset" : "DDR4",
            "DISK" : 50
        },
        "iots" : {}
    }
}

f3 = {
    "id" : "F3",
    "type" : "streetlight",
    "positioning" : "rfid",
    "x" : 664,
    "y" : 818,
    "role" : "agent",
    "leader" : "F4",
    "status" : 0,
    "description" : "Farola",
    "attributtes" : {
        "role" : "agent",
        "leader" : "F4",
        "resources" : {
            "CPU" : "1GHz",
            "Chipset" : "DDR4",
            "DISK" : 50
        },
        "iots" : {}
    }
}

f4 = {
    "id" : "F4",
    "type" : "streetlight",
    "positioning" : "rfid",
    "x" : 905,
    "y" : 818,
    "status" : 0,
    "description" : "Farola",
    "attributtes" : {
        "role" : "leader",
        "leader" : "",
        "resources" : {
            "CPU" : "1GHz",
            "Chipset" : "DDR4",
            "DISK" : 50
        },
        "iots" : {}
    }
}

f5 = {
    "id" : "F5",
    "type" : "streetlight",
    "positioning" : "rfid",
    "x" : 1023,
    "y" : 818,
    "status" : 0,
    "description" : "Farola",
    "attributtes" : {
        "role" : "agent",
        "leader" : "F4",
        "resources" : {
            "CPU" : "1GHz",
            "Chipset" : "DDR4",
            "DISK" : 50
        },
        "iots" : {}
    }
}


def bind_connection():
        my_socket.bind((ip, port))
        my_socket.listen(50)

def accept_connection():
        while True:
            agent_connection, addr = my_socket.accept()
            print("Se ha conectado el agent con addr ", addr)
            agent_connection.setblocking(0)
            agents.append(agent_connection)


def receive_request():
    while True:
        for agent in agents:
            try:
                msg = agent.recv(4096).decode()
                if(msg != None and msg != ""):
                    print(msg)
                    info = ""
                    if msg == STREETLIGHT_REQUEST:
                        info = json.dumps(streetlight_dict, ensure_ascii=False)
                    elif msg.split('_')[0] == SET_STREETLIGHT_COLOR:
                        car_position = msg.split('_')[1]
                        on_receive_status(car_position)
                    if info != "":
                        print(info)
                        agent.send(info.encode())
            except IOError as e:
                if(e.errno == errno.EWOULDBLOCK):
                    pass


def load_streetlights():
    conn = sqlite3.connect('map.db')
    cursor = conn.cursor()
    data = cursor.execute("select * from streetlights").fetchall()
    streetlights = {}
    for light in data:
        streetlights[light[0]] = light[1]
    return streetlights



def on_receive_status(*args):
    print(args)
    data = args[0]
    print("Recibido cambio de estado para: "+data["agente_id"]+". Estado: "+data["status"])
    arduino_message = data["agente_id"]+"_"+data["status"]
    streetlight_arduino.write(arduino_message.encode())
    frontend.sendStatus(data["agente_id"], data["status"])

def receive_frontend_request():
    if frontend:
       frontend.socket.on("front/agent/status", on_receive_status)
    while True:
        frontend.wait(1)

if __name__ == "__main__":
    try:
        params = get_params(sys.argv)
        host_frontend = params.get("host_frontend")
        port_frontend = params.get("port_frontend")
        ip = params.get("ip")
        port = int(params.get("port"))
        # load from db
        streetlight_dict = load_streetlights()

        agents = []
        streetlight_arduino = serial.Serial('/dev/arduinos/fs', 9600)
        my_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        bind_connection()
        Thread(target=accept_connection).start()
        Thread(target=receive_request).start()
        frontend = FrontendConnection(host_frontend, port_frontend) # Conexion con Frontend
        if frontend:
            Thread(target=receive_frontend_request).start()
        frontend.recognizeAgent(f1)
        frontend.recognizeAgent(f2)
        frontend.recognizeAgent(f3)
        frontend.recognizeAgent(f4)
        frontend.recognizeAgent(f5)

    except Exception as e:
        print("ERROR:{}".format(e))