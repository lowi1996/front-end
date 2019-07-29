from multiprocessing import Process
import json, time, pickle
import logging
import socket
import json
import ctypes


class DecisionMaker:

    STOP_DISTANCES = {
        0: 20,
        1: 10,
        2: 12,
        3: 13,
        4: 14,
        5: 15,
        6: 16,
        7: 17,
        8: 18,
        9: 19,
        10: 20
    }

    def __init__(self, car, params, vehicle_type, frontend, queue, emergency=False):
        self.car = car
        self.queue = queue
        self.vehicle_type = vehicle_type
        self.frontend = frontend
        self.traffic_light_ip = params["GESTION_SEMAFOROS_ip"]
        self.traffic_light_port = int(params["GESTION_SEMAFOROS_port"])
        self.streetlight_ip = params["GESTION_FAROLAS_ip"]
        self.streetlight_port = int(params["GESTION_FAROLAS_port"])
        self.traffic_ip = params.get("GESTION_TRAFICO_ip")
        self.traffic_port = int(params.get("GESTION_TRAFICO_port"))
        self.route_rfid = params["route_rfid"].split("@")
        self.route_actions = json.loads(params["route_actions"])
        self.end = params["Final"]
        self.s_traffic_light = self.connect_socket(self.traffic_light_ip, self.traffic_light_port)
        self.s_streetlight = self.connect_socket(self.streetlight_ip, self.streetlight_port)
        self.s_traffic = self.connect_socket(self.traffic_ip, self.traffic_port)
        self.request_leader_info()
        self.distance = 9999
        self.last_rfid = self.load_last_rfid()
        self.emergency = emergency

    def load_last_rfid(self):
        file = open("./config/car.config", "r")
        content = json.load(file)
        last_rfid = content["start_position_rfid"]
        file.close()
        return last_rfid

    def connect_socket(self, ip, port):
        try:
            s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
            s.connect((ip, port))
            return s
        except:
            return self.connect_socket(ip, port)

    def get_next_rfid(self):

        return

    def check_next_rfid(self):
        index = self.route_rfid.index(self.last_rfid)
        tag = self.card_ids[self.self.route_rfid[index + 1]]
        msg = "setAgentPosition_{}_{}".format(self.vehicle_type["id"], tag)
        self.s_traffic.send(msg.encode())
        response = self.s_traffic.recv(512).decode()
        if response == "free":
            return True
        else:
            return False

    def process_queue(self, queue):
        while True:
            if not queue.empty():
                info = queue.get()
                sel, value = info.split("-")
                if sel == "rfid":
                    # #print("RFID: " + value)
                    self.last_rfid = value
                    self.reposition_car()
                elif sel == "distance":
                    # #print("Distance: " + value)
                    self.distance = int(value)
                    # #print("He actualizado self.distance a {}".format(self.distance))
            self.check_final()
            if self.check_traffic_lights():
                self.check_distance()
                if self.emergency:
                    self.check_emergency_route()
                elif self.check_next_rfid():
                    self.check_route()
                self.check_streetlights()

    def check_final(self):
        if self.last_rfid in self.card_ids.keys() and self.card_ids[self.last_rfid] == self.end:
            print("Antes de hacer exit")
            self.car.stop()
            exit(0)

    def reposition_car(self):
        if self.frontend and (self.last_rfid in self.card_ids.keys()):
            self.frontend.repositionAgent(self.vehicle_type["id"], self.card_ids[self.last_rfid])
            self.write_position_to_file(self.last_rfid)

    def write_position_to_file(self, rfid):
        file = open("./config/car.config", "r+")
        content = json.load(file)
        content["start_position"] = self.card_ids[rfid]
        content["start_position_rfid"] = rfid
        file.seek(0)
        json.dump(content, file)
        file.truncate()
        file.close()

    def start(self, queue):
        # Process(target=self.message_received, args=(queue, )).start()
        self.process_queue_process = Process(target=self.process_queue, args=(queue, ))
        self.process_queue_process.start()
        self.process_queue_process.join()

    def request_leader_info(self):
        self.s_traffic_light.send("card_id_request".encode())
        card_ids = self.s_traffic_light.recv(5096)
        self.card_ids = json.loads(card_ids.decode())
        if self.emergency:
            self.s_traffic_light.send("emergency_traffic_light_request".encode())
            emergency_trafficlights = self.s_traffic_light.recv(5096)
            self.trafficlight_positions = json.loads(emergency_trafficlights.decode())
        else:
            self.s_traffic_light.send("traffic_light_request".encode())
            trafficlight_positions = self.s_traffic_light.recv(5096)
            self.trafficlight_positions = json.loads(trafficlight_positions.decode())
        self.s_streetlight.send("streetlight_request".encode())
        streetlight_positions = self.s_streetlight.recv(5096)
        #print(streetlight_positions)
        self.streetlight_positions = json.loads(streetlight_positions.decode())

    def message_received(self, queue):
        while True:
            message = self.s_traffic_light.recv(1024)
            if "responseTrafficLigtColor" in message:
                color = message.split('_')[1]
                queue.put("color-{}".format(color))

    def write_rfid_on_file(self):
        file = open("config/car.config", 'w')
        file.write(self.last_rfid)
        file.close()

    def check_streetlights(self):
        if self.last_rfid in self.streetlight_positions.keys():
            streetlight = self.streetlight_positions[self.last_rfid]
            #print("turnOnStreetlight_" + streetlight)
            self.s_streetlight.send(("turnOnStreetlight_" + streetlight).encode())

    def check_traffic_lights(self):
        if self.last_rfid in self.trafficlight_positions.keys():
            trafficlight = self.trafficlight_positions[self.last_rfid]
            # #print("requestTrafficLightStatus_" + trafficlight)
            if not self.emergency:
                self.s_traffic_light.send(("requestTrafficLightStatus_" + trafficlight).encode())
                traffic_light_status = self.s_traffic_light.recv(1024)
                traffic_light_status = traffic_light_status.split('_')[1]
                print("Color recibido: " + traffic_light_status)
                if traffic_light_status == "red" or traffic_light_status == "yellow":
                    self.car.stop()
                    return False
                elif self.car.is_car_stopped():
                    self.car.run()
                return True
            else:
                self.s_traffic_light.send(("requestEmergencyStatus_" + trafficlight).encode())
                return True

    def check_distance(self):
        distance = self.distance
        if distance <= self.STOP_DISTANCES[self.car.get_speed_level()]:
            self.car.stop()
        elif self.car.is_car_stopped() and self.last_rfid in self.card_ids.keys() and self.card_ids[self.last_rfid] != self.end:
            self.car.run()

    def check_route(self):
        if not self.car.is_car_stopped():
            if self.last_rfid in self.route_actions.keys():
                action = self.route_actions[self.last_rfid]
                print(action)
                if action == "turn_left":
                    self.car.left_corner()
                elif action == "turn_right":
                    self.car.right_corner()
                elif action == "go_straight":
                    self.car.go_straight()
                elif action == "stop":
                    print("Check route stop: {} - {}".format(self.card_ids[self.last_rfid], self.end))
                    self.car.stop()
