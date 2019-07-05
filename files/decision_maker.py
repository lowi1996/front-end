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

    def __init__(self, car, leader_ip, leader_port, params, vehicle_type, frontend, queue):
        self.car = car
        self.queue = queue
        self.vehicle_type = vehicle_type
        self.frontend = frontend
        self.leader_ip = leader_ip
        self.leader_port = int(leader_port)
        self.route_rfid = params["route_rfid"].split("@")
        self.route_actions = json.loads(params["route_actions"])
        self.end = params["Final"]
        self.s_traffic_light = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.s_traffic_light.connect((self.leader_ip, self.leader_port))
        self.request_leader_info()
        self.traffic_light_color = "red"
        self.distance = 9999
        self.last_rfid = ""

    def process_queue(self, queue):
        while True:
            if not queue.empty():
                info = queue.get()
                sel, value = info.split("-")
                if sel == "rfid":
                    # print("RFID: " + value)
                    self.last_rfid = value
                    self.reposition_car()
                elif sel == "distance":
                    # print("Distance: " + value)
                    self.distance = int(value)
                    # print("He actualizado self.distance a {}".format(self.distance))
                elif sel == "color":
                    # print("Color: " + value)
                    self.traffic_light_color = value
            self.check_stop()
            self.check_route()

    def reposition_car(self):
        if self.frontend and (self.last_rfid in self.card_ids.keys()):
            self.frontend.repositionAgent(self.vehicle_type["id"], self.card_ids[self.last_rfid])
            self.write_position_to_file(self.last_rfid)

    def write_position_to_file(self, rfid):
        file = open("./config/car.config", "r+")
        content = json.load(file)
        content["start_position"] = self.card_ids[rfid]
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
        self.s_traffic_light.send("traffic_light_request".encode())
        trafficlight_positions = self.s_traffic_light.recv(5096)
        self.trafficlight_positions = json.loads(trafficlight_positions.decode())
        self.s_traffic_light.send("street_light_request".encode())
        streetlight_positions = self.s_traffic_light.recv(5096)
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

    def load_last_rfid(self):
        try:
            file = open("config/car.config", 'r')
            self.last_rfid = file.readline()
            file.close()
            return self.last_rfid
        except:
            file = open("last_rfid.txt", 'w+')
            file.close()

    def check_stop(self):
        distance = self.distance
        if distance <= self.STOP_DISTANCES[self.car.get_speed_level()]:
            self.car.stop()
        elif self.last_rfid in self.trafficlight_positions.keys():
            if self.last_rfid in self.streetlight_positions.keys():
                streetlight = self.streetlight_positions[self.last_rfid]
                self.s_traffic_light.send(("requestTurnOnStreetLight_" + streetlight).encode())
            trafficlight = self.trafficlight_positions[self.last_rfid]
            # print("requestTrafficLightStatus_" + trafficlight)
            self.s_traffic_light.send(("requestTrafficLightStatus_" + trafficlight).encode())
            traffic_light_status = self.s_traffic_light.recv(1024)
            traffic_light_status = traffic_light_status.split('_')[1]
            # print("Color recibido: " + traffic_light_status)
            if traffic_light_status == "red" or traffic_light_status == "yellow":
                self.car.stop()
            elif self.car.is_car_stopped():
                self.car.run()
                self.traffic_light_color == "red"
        elif self.car.is_car_stopped() and self.last_rfid in self.card_ids.keys() and self.card_ids[self.last_rfid] != self.end:
            self.car.run()
        elif self.car.is_car_stopped() and self.last_rfid in self.card_ids.keys() and self.card_ids[self.last_rfid] == self.end:
            exit(0)

    def check_route(self):
        if not self.car.is_car_stopped():
            if self.last_rfid in self.route_actions.keys():
                action = self.route_actions[self.last_rfid]
                if action == "turn_left":
                    self.car.left_corner()
                elif action == "turn_right":
                    self.car.right_corner()
                elif action == "go_straight":
                    self.car.go_straight()
                elif action == "stop":
                    self.car.stop()
                self.last_rfid = ''
