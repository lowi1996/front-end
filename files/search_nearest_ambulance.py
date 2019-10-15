import json
import requests


def get_nearest_ambulance():
      if node_info["role"] == "cloud_agent":
          reg_service = self.agent.API.get_service(service)
          self.fill_service(service, reg_service)
          requester = self.get_service_requester(service)
          if requester and requester["role"] == "agent":
              leader = self.get_active_leader_from_agent(requester)
              if leader and (self.can_execute_service(service, leader) or self.can_execute_service(service, requester)):
                  return self.agent.API.request_service_to_agent(service, leader["myIP"])
              elif service.get("params") and not service.get("params").get("agent_id"):
                  agent_to_delegate = self.find_agent_to_delegate(service)
                  if agent_to_delegate:
                      if agent_to_delegate.get("leaderID") == self.agent.node_info["nodeID"]:
                          return self.agent.API.delegate_service(service, agent_to_delegate["myIP"])
                      elif agent_to_delegate.get("leaderID"):
                          return self.agent.API.request_service_to_agent(service, agent_to_delegate.get("leaderID"))
          elif requester:
              return self.agent.API.request_service_to_agent(service, requester["myIP"])
          return self.UNATTENDED_MESSAGE
      elif node_info["role"] == "leader":
          ambulances = get_my_ambulances()


def get_my_ambulances():
    my_ip = node_info["myIP"]
    request_info = json.dumps({"leaderIP": my_ip, "device": "ambulance", "status": 1})
    ambulances = requests.get("http://{}:8000/agent/{}".format(my_ip, request_info))
    print("Ambulancias: ", ambulances)
    return ambulances


if __name__ == '__main__':
    node_info = json.load("/etc/agent/config/device.config")
    get_nearest_ambulance()
