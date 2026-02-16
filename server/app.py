from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# O Docker passa a URI do banco via variável de ambiente (definida no compose)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017/scorefy_db")

client = MongoClient(MONGO_URI)
db = client["scorefy_db"]
collection = db["albums"]

@app.route('/api/albums', methods=['GET'])
def get_albums():
    try:
        # Busca álbuns e remove o _id interno para não dar erro no React
        albums = list(collection.find({}, {'_id': 0}))
        return jsonify(albums), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/albums', methods=['POST'])
def add_album():
    try:
        data = request.json
        collection.insert_one(data)
        return jsonify({"message": "Álbum adicionado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # No Docker, precisamos rodar em 0.0.0.0 para ser acessível fora do container
    app.run(debug=True, host='0.0.0.0', port=5000)