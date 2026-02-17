from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import os
import re
from datetime import datetime

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

# --- FUNÇÕES DE VALIDAÇÃO ---

def validar_string_segura(texto, obrigatorio=True):
    if not texto or not isinstance(texto, str):
        return not obrigatorio
    texto = texto.strip()
    if not (1 <= len(texto) <= 50):
        return False
    # Regex: Letras, números e espaços. Bloqueia símbolos e emojis.
    padrao = re.compile(r'^[a-zA-Z0-9áàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ\s]+$')
    return bool(padrao.match(texto))

def validar_ano(ano):
    try:
        ano_int = int(ano)
        return 1900 <= ano_int <= datetime.now().year
    except:
        return False

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
    campos = ['username', 'name', 'bio', 'location']
    for campo in campos:
        if not validar_string_segura(data.get(campo)):
            return jsonify({"error": f"Campo {campo} inválido ou muito longo"}), 400
    
    if users_col.find_one({"username": data['username']}):
        return jsonify({"error": "Username já existe"}), 400
        
    users_col.insert_one(data)
    return jsonify({"message": "Usuário cadastrado!"}), 201

# --- ROTAS DE ARTISTAS ---

@app.route('/api/artists', methods=['POST'])
def add_artist():
    data = request.json
    # Validações de texto (Nome, Bio, Gênero, País)
    for campo in ['name', 'bio', 'genre', 'country']:
        if not validar_string_segura(data.get(campo)):
            return jsonify({"error": f"Campo {campo} inválido"}), 400
    
    if not validar_ano(data.get('formed_year')):
        return jsonify({"error": "Ano de formação inválido"}), 400

    artists_col.insert_one(data)
    return jsonify({"message": "Artista adicionado"}), 201

@app.route('/api/artists', methods=['GET'])
def get_artists():
    artists = list(artists_col.find({}, {"_id": 0}))
    return jsonify(artists), 200

# --- ROTAS DE ÁLBUNS ---

@app.route('/api/albums', methods=['POST'])
def add_album():
    data = request.json
    for campo in ['title', 'description', 'genre']:
        if not validar_string_segura(data.get(campo)):
            return jsonify({"error": f"Campo {campo} inválido"}), 400
            
    if not validar_ano(data.get('year')):
        return jsonify({"error": "Ano do álbum inválido"}), 400
    
    albums_col.insert_one(data)
    return jsonify({"message": "Álbum adicionado"}), 201

@app.route('/api/albums', methods=['GET'])
def get_albums():
    albums = list(albums_col.find({}, {"_id": 0}))
    return jsonify(albums), 200

# --- ROTAS DE REVIEWS ---

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.json
    if not (0 <= data.get('rating', -1) <= 5) or not validar_string_segura(data.get('text')):
        return jsonify({"error": "Review inválida ou nota fora de 0-5"}), 400
    
    data['created_at'] = datetime.now().strftime("%Y-%m-%d")
    reviews_col.insert_one(data)
    return jsonify({"message": "Review enviada"}), 201

# --- ROTAS DE PLAYLISTS ---

@app.route('/api/playlists', methods=['POST'])
def create_playlist():
    data = request.json
    if not validar_string_segura(data.get('name')):
        return jsonify({"error": "Nome da playlist inválido"}), 400
        
    new_playlist = {
        "name": data['name'],
        "owner_username": data['username'],
        "album_ids": data.get('album_ids', []),
        "description": data.get('description', '')
    }
    playlists_col.insert_one(new_playlist)
    return jsonify({"message": "Playlist criada"}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)