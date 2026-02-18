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

# --- LISTAR ARTISTAS (Com filtro opcional de gênero) ---
@app.route('/api/artists', methods=['GET'])
def get_artists():
    genre = request.args.get('genre')
    query = {}
    if genre:
        query = {"genre": {"$regex": f"^{genre}$", "$options": "i"}}
    artists = list(artists_col.find(query, {"_id": 0}))
    return jsonify(artists), 200

# --- LISTAR ÁLBUNS (Com filtro opcional de gênero) ---
@app.route('/api/albums', methods=['GET'])
def get_albums():
    genre = request.args.get('genre')
    
    pipeline = [
        # 1. Filtra pelo gênero (se houver)
        {"$match": {"genre": {"$regex": f"^{genre}$", "$options": "i"}}} if genre else {"$match": {}},
        
        # 2. Busca os dados do artista correspondente
        {
            "$lookup": {
                "from": "artists",
                "localField": "id_artista",
                "foreignField": "id_artista",
                "as": "artist_info"
            }
        },
        
        # 3. Transforma a lista de artistas em um objeto único
        {"$unwind": "$artist_info"},
        
        # 4. Projeta TODOS os campos necessários
        {"$project": {
            "_id": 0,
            "id_album": 1,           # Adicionado
            "id_artista": 1,         # Adicionado
            "title": 1,
            "genre": 1,
            "year": 1,
            "description": 1,       # Adicionado
            "image": 1,
            "artist_name": "$artist_info.name"
        }}
    ]
    
    albums = list(albums_col.aggregate(pipeline))
    return jsonify(albums), 200
# --- ROTA DE BUSCA GLOBAL (Necessária para o Front) ---
@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"artists": [], "albums": []}), 200
    
    # 1. Busca artistas pelo nome
    artists = list(artists_col.find({"name": {"$regex": query, "$options": "i"}}, {"_id": 0}))
    
    # 2. Busca álbuns pelo título
    albums = list(albums_col.find({"title": {"$regex": query, "$options": "i"}}, {"_id": 0}))
    
    # 3. Lógica extra: Se achamos artistas, vamos buscar os álbuns deles também!
    if artists:
        for artist in artists:
            artist_id = artist.get("id_artista")
            extra_albums = list(albums_col.find({"id_artista": artist_id}, {"_id": 0}))
            # Adiciona apenas os que já não foram encontrados pelo título
            for ea in extra_albums:
                if ea not in albums:
                    albums.append(ea)

    return jsonify({"artists": artists, "albums": albums}), 200

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