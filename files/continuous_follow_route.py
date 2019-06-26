import sys
import json
import subprocess
import requests
from util import get_params


try:
    params = get_params(sys.argv)
    my_ip = subprocess.getoutput("hostname -I | awk '{print $1}'")
    agent_id = params["agent_id"]

    while True:
        requests.post(
            "http://{}:8000/request_service".format(my_ip),
            json={"service_id": "FOLLOW_ROUTE", "agent_id": agent_id, "params": params}
        )
    print(json.dumps({"message": "Continuous follow route successfully executed"}))
except Exception as e:
    print("ERROR:{}".format(e))
