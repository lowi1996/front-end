import sys
import json
import subprocess
import requests


try:
    my_ip = subprocess.getoutput("hostname -I | awk '{print $1}'")
    while True:
        requests.post(
            "http://{}:8000/request_service".format(my_ip),
            json={"service_id": "FOLLOW_ROUTE_FISICO"}
        )
    print(json.dumps({"message": "Continuous follow route successfully executed"}))
except Exception as e:
    print("ERROR:{}".format(e))
