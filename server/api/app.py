import os
import json

from flask import Flask, request
from urllib.parse import unquote

app = Flask(__name__)

PROGRESS_FILE_PATH = "progress_data.json"
DISCIPLINE_FILE_PATH = "discipline_data.json"

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
    json_file = open_json(DISCIPLINE_FILE_PATH)
    discipline_dict = json_file.get(discipline, {})
    return discipline_dict

@app.route('/api/discipline/save', methods=['POST'])
def save_data():
    data = request.get_json()
    discipline_id = unquote(data.get("disciplineId", 0))
    print(discipline_id)
    json_file = open_json(DISCIPLINE_FILE_PATH)
    json_file[discipline_id] = data
    save_json(json_file,DISCIPLINE_FILE_PATH)
    return {'message': 'Data saved successfully', 'data': data}, 200

@app.route('/api/discipline/data/node', methods=['GET'])
def get_node_data():
    """Provide discipline id and node id to get node data from json file"""
    discipline_id = request.args.get("disciplineId", type=str)
    json_file = open_json(DISCIPLINE_FILE_PATH)
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
    json_file = open_json(DISCIPLINE_FILE_PATH)
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
    save_json(json_file,DISCIPLINE_FILE_PATH)
    return {'message': 'Node data saved successfully', 'data': data}, 200



@app.route('/api/discipline/progress', methods=['GET'])
def get_progress():
    discipline_id = request.args.get("discipline", type=str)
    user_id = request.args.get("userId", type=str)
    json_file = open_json(PROGRESS_FILE_PATH)
    # Get discipline 
    discipline_progress = json_file.get(discipline_id, {})
    # Get user progress
    user_progress = discipline_progress.get(user_id, {})
    
    return {'message': 'Progress retrieved successfully', 'data': user_progress}, 200

@app.route('/api/discipline/progress/save', methods=['POST'])
def save_progress():
    data = request.get_json()
    print(data) # {'discipline_id': '%D0%9E%D0%9F%D0%B8%D0%90', 'node_id': 'Должен знать что такое абоба', 'user_id': '123', 'checked': False}
    discipline_id = unquote(data.get("discipline_id", ''))
    node_id = unquote(data.get("node_id", ''))
    question_text = unquote(data.get("questionText", ''))
    user_id = unquote(data.get("user_id", ''))
    checked = data.get("checked", False)
    json_file = open_json(PROGRESS_FILE_PATH)

    # Create discipline if it doesn't exist
    if discipline_id not in json_file:
        json_file[discipline_id] = {}
    # Create user if it doesn't exist
    if user_id not in json_file[discipline_id]:
        json_file[discipline_id][user_id] = {}
    # Create node if it doesn't exist
    if node_id not in json_file[discipline_id][user_id]:
        json_file[discipline_id][user_id][node_id] = {}
    # Create question if it doesn't exist
    if question_text not in json_file[discipline_id][user_id][node_id]:
        json_file[discipline_id][user_id][node_id][question_text] = {}
    # Save progress
    json_file[discipline_id][user_id][node_id][question_text] = checked

    save_json(json_file,PROGRESS_FILE_PATH)
    return {'message': 'Progress saved successfully', 'data': data}, 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
