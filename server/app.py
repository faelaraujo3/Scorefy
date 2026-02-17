from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import os
import re

app = Flask(__name__)
CORS(app)

# Conexão MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017/scorefy_db")
client = MongoClient(MONGO_URI)
db = client["scorefy_db"]

# Coleções
users_col = db["users"]
artists_col = db["artists"]
albums_col = db["albums"]
reviews_col = db["reviews"]
playlists_col = db["playlists"]

# --- FUNÇÃO DE VALIDAÇÃO (Regra: 1-50 chars, sem especiais/emojis) ---
def validar_string_segura(texto, obrigatorio=True):
    if not texto or not isinstance(texto, str):
        return not obrigatorio
    
    texto = texto.strip()
    if not (1 <= len(texto) <= 50):
        return False
    
    # Regex: Apenas letras (com acentos), números e espaços. Bloqueia símbolos e emojis.
    padrao = re.compile(r'^[a-zA-Z0-9áàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ\s]+$')
    return bool(padrao.match(texto))

# --- ROTAS DE USUÁRIO ---
@app.route('/api/users/<username>', methods=['GET'])
def get_profile(username):
    user = users_col.find_one({"username": username}, {"_id": 0})
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify(user), 200

@app.route('/api/users', methods=['POST'])
def register_user():
    data = request.json
    if not validar_string_segura(data.get('username')) or not validar_string_segura(data.get('name')):
        return jsonify({"error": "Dados inválidos ou com caracteres especiais"}), 400
    
    if users_col.find_one({"username": data['username']}):
        return jsonify({"error": "Username já existe"}), 400
        
    users_col.insert_one(data)
    return jsonify({"message": "Usuário cadastrado!"}), 201

# --- ROTAS DE ARTISTAS E ÁLBUNS ---
@app.route('/api/artists', methods=['POST'])
def add_artist():
    data = request.json
    # Valida nome e a nova descrição/bio
    if not validar_string_segura(data.get('name')) or not validar_string_segura(data.get('bio')):
        return jsonify({"error": "Nome/Bio inválidos (máx 50 chars, sem símbolos)"}), 400
    
    artists_col.insert_one(data)
    return jsonify({"message": "Artista adicionado"}), 201

@app.route('/api/albums', methods=['POST'])
def add_album():
    data = request.json
    if not validar_string_segura(data.get('title')) or not validar_string_segura(data.get('description')):
        return jsonify({"error": "Título/Descrição inválidos (máx 50 chars, sem símbolos)"}), 400
    
    albums_col.insert_one(data)
    return jsonify({"message": "Álbum adicionado"}), 201

# --- ROTAS DE REVIEWS (Relaciona Usuário e Álbum) ---
@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.json
    # Nota de 0 a 5 e texto limpo
    if not (0 <= data.get('rating', -1) <= 5) or not validar_string_segura(data.get('text')):
        return jsonify({"error": "Review inválida"}), 400
    
    reviews_col.insert_one(data)
    return jsonify({"message": "Review enviada"}), 201

# --- ROTAS DE PLAYLISTS (Diferencial NoSQL: Array de IDs) ---
@app.route('/api/playlists', methods=['POST'])
def create_playlist():
    data = request.json
    if not validar_string_segura(data.get('name')):
        return jsonify({"error": "Nome da playlist inválido"}), 400
        
    new_playlist = {
        "name": data['name'],
        "owner": data['username'],
        "album_ids": data.get('album_ids', []) # Array de IDs
    }
    playlists_col.insert_one(new_playlist)
    return jsonify({"message": "Playlist criada"}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)