import os
import json

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, request
from urllib.parse import unquote

app = Flask(__name__)

DATA_FILE_PATH = 'saved_data.json'

def open_json():
    try:
        with open(DATA_FILE_PATH, 'r') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        # If the file doesn't exist, create it
        data = {}
        save_json(data)

    return data

def save_json(data):
    with open(DATA_FILE_PATH, 'w') as json_file:
        json.dump(data, json_file)

@app.route("/api/discipline/data", methods=["GET"])
def getNodes():
    discipline = request.args.get("discipline", type=str)
    json_file = open_json()
    discipline_dict = json_file.get(discipline, {})
    print("GETTEN DATA:",discipline_dict)
    return discipline_dict

@app.route('/api/discipline/save', methods=['POST'])
def save_data():
    data = request.get_json()

    # Here you would typically save the data to a database or a file
    # For the sake of this example, let's just print it
    print(data)
    # Search for discipline in json
    discipline_id = unquote(data.get("disciplineId", 0))
    print(discipline_id)
    json_file = open_json()
    json_file[discipline_id] = data
    print(json_file)
    save_json(json_file)
    return {'message': 'Data saved successfully', 'data': data}, 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
