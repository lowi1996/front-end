import json

try:
  p_file = open("./config/car.config", "r")
  position = p_file.readline()
  print(json.dumps({"Inicio":position}))
except Exception, e:
  print("Error:{}".format(e))
  
