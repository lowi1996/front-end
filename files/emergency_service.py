import sys
import json
import subprocess
import requests
import time
from util import get_params

def get_start_position():
    p_file = open("./config/car.config", "r")
    content = json.load(p_file)
    position = content["start_position"]
    p_file.close()
    return position

def prepare_params(params):
    result = ""
    if params:
        for key, value in params.items():
            if value:
                if(type(value) is dict):
                    result += key + "='" + json.dumps(value) + "' "
                    # print("Es diccionario {}".format(value))
                elif(type(value) is list):
                    # print("Es lista {}".format(value))
                    result += key + "="
                    for item in value:
                        result+=item+"@"
                    result += " "
                elif value != "":
                    result += key + "=" + str(value) + " "
    # print("RESULTADOOOOOOOOOOOOOOO {}".format(result))
    return result

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
    # print("DEVUELVOOOOO {}".format(route))
    return route

route_params = " ".join(str(x) for x in sys.argv)
params = get_params(sys.argv)
my_ip = subprocess.getoutput("hostname -I | awk '{print $1}'")
agent_id = params["agent_id"]


params["route_actions"] = "'" + params["route_actions"] + "'"
route_params = prepare_params(params)
params["Inicio"] = params["Final"]
params["Final"] = "N1"

# print()
# print("previous params: {}".format(params))
# print()

next_route_params = get_route(my_ip, agent_id, params)
# print("paramsssss {}".format(params))
next_route_params = prepare_params(next_route_params)
# print("nexttttttt {}".format(next_route_params))


route_params += " emergency=True"
next_route_params += " emergency=True"

output = subprocess.getoutput("python2 ./codes/follow_route_fisico.py " + route_params)
# print(output)
time.sleep(3)
output = subprocess.getoutput("python2 ./codes/follow_route_fisico.py " + next_route_params)
# print(output)
