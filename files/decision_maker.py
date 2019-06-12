from multiprocessing import Queue
import json, time, pickle
import logging


class DecisionMaker:

    GREEN = 'green'
    YELLOW = 'yellow'
    RED = 'red'

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

    def __init__(self, car, sensors, line_follower, frontend, params):
        self.car = car
        self.CAR = CAR
        self.sensors = sensors
        self.line_follower = line_follower
        self.frontend = frontend
        self.card_ids = card_ids
        self.frontend = frontend
        self.leader_ip = params["socket_ip"]
        self.leader_port = params["socket_port"]
        self.route_rfid = params["route_rfid"]
        self.end = params["Final"]
        self.route_actions = params["route_actions"]
        self.s_traffic_light = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.s_traffic_light.connect((self.leader_ip, self.leader_port))
        self.request_leader_info()
        self.traffic_light_color = "red"
        self.distance = 9999
        self.last_rfid = ""
        Thread(target=message_received).start()
        Thread(target=get_ultrasonic_data).start()
        Thread(target=get_rfid_data).start()
        Thread(target=start_following_line).start()

    def request_leader_info(self):
        self.s_traffic_light.send("card_id_request".encode())
        self.card_ids = self.s_traffic_light.recv(5096)
        self.card_ids = json.loads(card_ids.decode())
        self.s_traffic_light.send("traffic_light_request".encode())
        self.trafficlight_positions = self.s_traffic_light.recv(5096)
        self.trafficlight_positions = json.loads(trafficlight_positions.decode())
        self.s_traffic_light.send("request_nested_leaders".encode())
        self.nested_leaders = self.s_traffic_light.recv(5096)
        self.nested_leaders = json.loads(nested_leaders.decode())

    def get_ultrasonic_data(self):
        while True:
            self.distance = self.sensors.read_distance()

    def get_rfid_data(self):
        while True:
            tag = self.sensors.read_RFID()
            if self.frontend and (tag in self.card_ids.keys()):
                self.last_rfid = tag
                self.frontend.repositionAgent(self.CAR["id"], self.card_ids[tag])

    def start_following_line(self):
        self.line_follower.follow_line()

    def message_received(self):
        while True:
            message = self.s_traffic_light.recv(1024)
            if "responseTrafficLigtColor" in message:
                color = message.split('_')[1]
                self.traffic_light_color = color

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

    def check_stop(self, distance):
        if self.distance <= self.STOP_DISTANCES[self.car.get_speed_level()]:
            self.car.stop()
        elif self.last_rfid in self.trafficlight_positions.keys():
            trafficlight = self.trafficlight_positions[self.last_rfid]
            self.s_traffic_light.send((self.agent.REQUEST_TRAFFIC_LIGHT_STATUS + '_' + trafficlight).encode())
            traffic_light_status = self.traffic_light_color
            if traffic_light_status == "red" or traffic_light_status == "yellow":
                self.car.stop()
            elif self.car.is_car_stopped():
                self.car.run()
                self.traffic_light_color == "red"
        elif self.car.is_car_stopped() and self.last_rfid in self.card_id.keys() and self.card_id[self.last_rfid] != self.end:
            self.car.run()

    def check_route(self, queue):
        if not self.car.is_car_stopped():
            if self.last_rfid in self.route_rfid.keys():
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
