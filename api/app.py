import os

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, request

app = Flask(__name__)

uri = os.environ.get("MONGO_CONNECTION_URI")


@app.route("/api/discipline/data", methods=["GET"])
def getNodes():
    discipline = request.args.get("discipline", type=str)
    data = {
        "discipline": discipline,
    }
    return data
    


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
