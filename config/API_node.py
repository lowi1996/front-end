import hug
import pprint
import pymongo
import json
from bson.json_util import dumps
from bson import json_util

# la mongoDB is running in cluster Zephyrus
from hug_middleware_cors import CORSMiddleware

api = hug.API(__name__)
api.http.add_middleware(CORSMiddleware(api))

# client=pymongo.MongoClient('192.168.1.34', 27017)
# client=pymongo.MongoClient('10.0.2.16', 27017)
client=pymongo.MongoClient('127.0.0.1', 27017)
topoDB=client.globalDB
nodes= {
    "address": "147.83.159.100",
    "role": "agent",
    "device":"on",
    "nodeID": 1234

}
#Method.
collection=topoDB.nodes
service_catalog=topoDB.service_catalog

@hug.post('/post_topoDB')
def post_topoDB(body):
    """Insert a new document
    Request:response=(requests.post('http://147.83.159.220:8000/post_topoDB', data=post)
    being
    node_info={
        'device':'None',
        'role':'None',
        'myIP':'None',
        'leaderIP':'None',
        'port':'None',
        'node_ID':'None',
        'IoT':'None'
    }"""
    print(body,type(body))
    try:
        nodeID = collection.find_and_modify(query= { '_id': 'nodeID' },update= { '$inc': {'seq': 1}}, new=True ).get('seq')
        body['_id'] = str(int(nodeID))
        collection.insert_one(body)
    except pymongo.errors.DuplicateKeyError as e:
        nodeID = post_topoDB(body)

    return str(int(nodeID))

@hug.post('/update_topoDB')
def update_topoDB(body):
    """Update database if data exists, else post a new document
    Request:response=(requests.post('http://147.83.159.220:8000/update_topoDB', data=node_info))"""

    print("dic:",body,"type:", type(body))
    id = body['nodeID'].strip("0")
    collection.update({'_id': id},{"$set":body},True)

@hug.get('/get_topoDB')
def get_topoDB(selec=None):
    """
    PARAMS="selec={'myIP':"+"'"+node_info['myIP']+"'}"
    request:response=(requests.get('http://147.83.159.220:8000/get_topoDB',PARAMS)).json() """
    print(selec)
    agent_list=[]
    if selec != None:
        if type(selec) == list:
            info = ""
            for elem in selec:
                info = info + elem + ","
            info = info[:-1]
            selec = info
        selec=eval(selec)
        print(selec,type(selec))
    num = collection.count_documents({})
    for agent_mongo in collection.find(selec):
    # convert mongo document to json
        print("type agentmongo:", type(agent_mongo))
        agent_list.append(agent_mongo)

    agent_json = json.dumps(agent_list, default=json_util.default)
    print(agent_json)
    #selec = json.dumps(selec, default=json_util.default)
    return agent_json, num, selec


@hug.post('/post_service')
def post_service(body):
    print(body,type(body))
    body["_id"] = body["_id"].upper()
    if body.get("MEM") or body.get("CPU"):
        body["resource"] = {}
        if body.get("MEM"):
            body["resource"]["MEM"] = body.get("MEM")
            del body["MEM"]
        if body.get("CPU"):
            body["resource"]["CPU"] = body.get("CPU")
            del body["CPU"]
    if body.get("is_infinite") and body.get("is_infinite") == "true":
        body["is_infinite"] = True
    else:
        body["is_infinite"] = False
    if body.get("dependencies"):
        l = []
        for dependency in body.get("dependencies").split(" "):
            l.append(dependency.upper())
        body["dependencies"] = l
    if body.get("IoT"):
        l = []
        for iot in body.get("IoT").split(" "):
            l.append(iot)
        body["IoT"] = l
    if body.get("params"):
        d = {}
        for param in body.get("params").split(" "):
            key, tipo = param.split("=")
            d[key] = tipo
        body["params"] = d



    service_catalog.insert_one(body)


@hug.get('/get_serviceDB')
def get_serviceDB(selec=None):
    """
    PARAMS="selec={'myIP':"+"'"+node_info['myIP']+"'}"
    request:response=(requests.get('http://147.83.159.220:8000/get_topoDB',PARAMS)).json() """
    print(selec)
    service_list=[]
    if selec != None:
        if type(selec) == list:
            info = ""
            for elem in selec:
                info = info + elem + ","
            info = info[:-1]
            selec = info
        selec=eval(selec)
        print(selec,type(selec))
    num = service_catalog.count_documents({})
    for service_mongo in service_catalog.find(selec):
    # convert mongo document to json
        print("type agentmongo:", type(service_mongo))
        service_list.append(service_mongo)

    service_json = json.dumps(service_list, default=json_util.default)
    print(service_json)
    #selec = json.dumps(selec, default=json_util.default)
    return service_json, num, selec

@hug.get('/del_topoDB')
def del_topoDB(index=None):
    """request: requests.get('http://147.83.159.220:8000/del_topoDB',"index={'rol': 'leader'}")"""
    index=eval(index)
    print(index, type(index))
    collection.delete_many(index)
# reset all documents
@hug.get('/reset_topoDB')
def reset_topoDB():
    """request: requests.get('http://147.83.159.220:8000/reset_topoDB')"""
    collection.remove({})
