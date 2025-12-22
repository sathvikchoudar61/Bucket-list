from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

DATA_FILE = "data/bucket.json"
os.makedirs("data", exist_ok=True)

def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

@app.route("/items", methods=["GET"])
def get_items():
    return jsonify(read_data())

@app.route("/items", methods=["POST"])
def save_items():
    write_data(request.json)
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
