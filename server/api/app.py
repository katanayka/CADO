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


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
