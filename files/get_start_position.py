import json

try:
  p_file = open("./config/car.config", "r")
  content = json.load(p_file)
  position = content["start"]
  p_file.close()
  print(json.dumps({"Inicio": position}))
except Exception, e:
  print("Error:{}".format(e))
  
