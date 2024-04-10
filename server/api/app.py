import os
import json

from flask import Flask, request
from urllib.parse import unquote

app = Flask(__name__)

def open_json(DATA_FILE_PATH):
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        # If the file doesn't exist, create it
        data = {}
        save_json(data, DATA_FILE_PATH)

    return data

def save_json(data, DATA_FILE_PATH):
    with open(DATA_FILE_PATH, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False)
        
def get_node_data_from_tree(node, node_id):
    if node.get("id") == node_id:
        return node
    for child in node.get("children", []):
        result = get_node_data_from_tree(child, node_id)
        if result:
            return result
    return None

@app.route("/api/discipline/data", methods=["GET"])
def get_data():
    discipline = request.args.get("discipline", type=str)
    json_file = open_json('discipline_data.json')
    discipline_dict = json_file.get(discipline, {})
    print("GETTEN DATA:",discipline_dict)
    return discipline_dict

@app.route('/api/discipline/save', methods=['POST'])
def save_data():
    data = request.get_json()
    discipline_id = unquote(data.get("disciplineId", 0))
    print(discipline_id)
    json_file = open_json("discipline_data.json")
    json_file[discipline_id] = data
    save_json(json_file,"discipline_data.json")
    return {'message': 'Data saved successfully', 'data': data}, 200

@app.route('/api/discipline/data/node', methods=['GET'])
def get_node_data():
    """Provide discipline id and node id to get node data from json file"""
    discipline_id = request.args.get("disciplineId", type=str)
    json_file = open_json("discipline_data.json")
    discipline_data = json_file.get(discipline_id, {}).get("dataTree", {}).get("trees", [])
    node_data = {}
    for tree in discipline_data:
        root = tree.get("root")
        # Recursively search for the node with the given id
        node_data = get_node_data_from_tree(root, request.args.get("nodeId", type=str))
        
    print(node_data)
    if not node_data:
        return {'message': 'Node data not found'}, 404
    return {'message': 'Node data retrieved successfully', 'data': node_data}, 200

@app.route('/api/discipline/data/node/save', methods=['POST'])
def save_node_data():
    """Provide discipline id and node id to save node data to json file"""
    data = request.get_json()
    discipline_id = unquote(data.get("disciplineId", 0))
    json_file = open_json("discipline_data.json")
    discipline_data = json_file.get(discipline_id, {}).get("dataTree", {}).get("trees", [])
    node_data = data.get("nodeData", {})
    print(node_data)
    for tree in discipline_data:
        root = tree.get("root")
        # Recursively search for the node with the given id
        node_data = get_node_data_from_tree(root, node_data.get("data").get("id"))
        if node_data:
            print("NODE DATA:",node_data)
            node_data.update(data.get("nodeData", {}))
            break
    save_json(json_file,"discipline_data.json")
    return {'message': 'Node data saved successfully', 'data': data}, 200



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
