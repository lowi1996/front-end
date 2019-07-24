import sys
import json
import socket
import sqlite3
import errno
from threading import Thread
from util import get_params
# from frontend_connection import FrontendConnection


CARD_ID_REQUEST = "card_id_request"
SET_AGENT_POSITION = "setAgentPosition"

def load_card_ids():
    conn = sqlite3.connect('map.db')
    cursor = conn.cursor()
    data = cursor.execute("select * from card_id").fetchall()
    card_ids = {}
    for card_id in data:
        card_ids[card_id[1]] = card_id[0]
    return card_ids


def bind_connection():
        my_socket.bind((ip, port))
        my_socket.listen(50)

def accept_connection():
        while True:
            agent_connection, addr = my_socket.accept()
            print("Se ha conectado el agent con addr ", addr)
            agent_connection.setblocking(0)
            agents.append(agent_connection)

def update_rfid_status(data):
    car_id = data[1]
    next_position = data[2]

    # si la posicion a la que vamos esta vacia
    if rfid_status[next_position] == 0:
        # vaciamos la posicion anterior donde estaba el coche
        previous_position = cars_position.get(car_id)
        if previous_position:
            rfid_status[previous_position] = 0
        # una vez vaciado lo asignamos a la posicion donde va
        rfid_status[next_position] = 1
        cars_position[card_id] = next_position    
        return "free"
    else:
        return "busy"



def receive_request():
    while True:
        for agent in agents:
            try:
                msg = agent.recv(4096).decode()
                if msg != None and msg != "":
                    print(msg)
                    info = ""
                    if msg == CARD_ID_REQUEST:
                        info = json.dumps(card_id_dict, ensure_ascii=False)
                    elif msg.split("_")[0] == SET_AGENT_POSITION:
                        data = msg.split("_")
                        info = update_rfid_status()
                    if info != "":
                        print(info)
                        agent.send(info.encode())
            except IOError as e:
                if(e.errno == errno.EWOULDBLOCK):
                    pass


'''
Metodo para poner todas las posiciones como vacias
'''
def create_rfid_status():
    rfid_status = {}
    for rfid in card_id_dict.keys():
        rfid_status[rfid] = 0
    return rfid_status

if __name__ == "__main__":
    try:
        params = get_params(sys.argv)
        host_frontend = params.get("host_frontend")
        port_frontend = params.get("port_frontend")
        ip = params.get("ip")
        port = int(params.get("port"))
        # load from db
        card_id_dict = load_card_ids()
        rfid_status = create_rfid_status()
        cars_position = {}
        agents = []
        my_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        bind_connection()
        Thread(target=accept_connection).start()
        # Thread(target=receive_request).start()
        receive_request()

        # frontend = FrontendConnection(host_frontend, port_frontend) # Conexion con Frontend



    except Exception as e:
        print("ERROR:{}".format(e))
