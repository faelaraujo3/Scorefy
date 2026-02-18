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

# Coleções (Rafael solicitou 'usuario' para a coleção de usuários)
usuarios_col = db["users"] 
artistas_col = db["artists"]
albuns_col = db["albums"]
criticas_col = db["reviews"]
playlists_col = db["playlists"]

# --- FUNÇÕES DE VALIDAÇÃO ---

def validar_string_segura(texto, obrigatorio=True):
    if not texto or not isinstance(texto, str):
        return not obrigatorio
    texto = texto.strip()
    if not (1 <= len(texto) <= 50):
        return False
    # Suporte a caracteres da língua portuguesa
    padrao = re.compile(r'^[a-zA-Z0-9áàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ\s]+$')
    return bool(padrao.match(texto))

# --- ROTAS DE AUTENTICAÇÃO E PERFIL ---

@app.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({"error": "E-mail e senha são obrigatórios"}), 400

    if usuarios_col.find_one({"email": email}):
        return jsonify({"error": "E-mail já cadastrado"}), 400

    # Estrutura inicial do usuário (username permanece em inglês conforme Rafael sugeriu)
    novo_usuario = {
        "email": email,
        "senha": senha,
        "username": "",    # Será definido na atualização de perfil
        "nome": "",        # Nome de exibição
        "bio": "",
        "localizacao": "",
        "albuns_favoritos": []
    }
    
    usuarios_col.insert_one(novo_usuario)
    return jsonify({"message": "Conta criada! Agora complete seu perfil."}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')
    
    usuario_db = usuarios_col.find_one({"email": email, "senha": senha}, {"_id": 0})
    
    if not usuario_db:
        return jsonify({"error": "E-mail ou senha incorretos"}), 401
        
    return jsonify({"message": "Login realizado!", "user": usuario_db}), 200

@app.route('/api/usuarios/<email>', methods=['PUT'])
def atualizar_perfil(email):
    data = request.json
    
    # Validações para os novos campos de perfil
    for campo in ['username', 'nome', 'bio', 'localizacao']:
        if data.get(campo) and not validar_string_segura(data.get(campo)):
            return jsonify({"error": f"Campo {campo} inválido"}), 400

    # Garantir que o username seja único se for alterado
    novo_username = data.get('username')
    if novo_username:
        existente = usuarios_col.find_one({"username": novo_username, "email": {"$ne": email}})
        if existente:
            return jsonify({"error": "Username já está em uso"}), 400

    atualizacao = {
        "username": data.get('username', ""),
        "nome": data.get('nome', ""),
        "bio": data.get('bio', ""),
        "localizacao": data.get('localizacao', "")
    }
    
    usuarios_col.update_one({"email": email}, {"$set": atualizacao})
    return jsonify({"message": "Perfil atualizado!"}), 200

@app.route('/api/usuarios/<username>', methods=['GET'])
def obter_perfil(username):
    user = usuarios_col.find_one({"username": username}, {"_id": 0, "senha": 0})
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify(user), 200

# --- LISTAGEM E BUSCA (COM LÓGICA DE AGGREGAÇÃO E REGEX) ---

@app.route('/api/albuns', methods=['GET'])
def listar_albuns():
    genero = request.args.get('genero')
    
    pipeline = [
        {"$match": {"genre": {"$regex": f"^{genero}$", "$options": "i"}}} if genero else {"$match": {}},
        {
            "$lookup": {
                "from": "artists",
                "localField": "id_artista",
                "foreignField": "id_artista",
                "as": "artista_info"
            }
        },
        {"$unwind": "$artista_info"},
        {"$project": {
            "_id": 0,
            "id_album": 1,
            "id_artista": 1,
            "title": 1,
            "genre": 1,
            "year": 1,
            "description": 1,
            "image": 1,
            "nome_artista": "$artista_info.name"
        }}
    ]
    
    albuns = list(albuns_col.aggregate(pipeline))
    return jsonify(albuns), 200

@app.route('/api/busca', methods=['GET'])
def busca_global():
    termo = request.args.get('q', '')
    if not termo:
        return jsonify({"artistas": [], "albuns": []}), 200
    
    # 1. Busca artistas e álbuns por texto (case insensitive)
    artistas = list(artistas_col.find({"name": {"$regex": termo, "$options": "i"}}, {"_id": 0}))
    albuns = list(albuns_col.find({"title": {"$regex": termo, "$options": "i"}}, {"_id": 0}))
    
    # 2. Busca álbuns dos artistas encontrados (busca inteligente)
    if artistas:
        for art in artistas:
            artista_id = art.get("id_artista")
            alb_extras = list(albuns_col.find({"id_artista": artista_id}, {"_id": 0}))
            for ae in alb_extras:
                if ae not in albuns:
                    albuns.append(ae)

    return jsonify({"artistas": artistas, "albuns": albuns}), 200

# --- CRÍTICAS E PLAYLISTS ---

@app.route('/api/criticas', methods=['POST'])
def adicionar_critica():
    data = request.json
    if not (0 <= data.get('rating', -1) <= 5) or not validar_string_segura(data.get('text')):
        return jsonify({"error": "Crítica inválida"}), 400
    
    data['created_at'] = datetime.now().strftime("%Y-%m-%d")
    criticas_col.insert_one(data)
    return jsonify({"message": "Crítica enviada"}), 201

@app.route('/api/playlists', methods=['POST'])
def criar_playlist():
    data = request.json
    if not validar_string_segura(data.get('name')):
        return jsonify({"error": "Nome da playlist inválido"}), 400
        
    nova_playlist = {
        "name": data['name'],
        "owner_username": data['username'],
        "album_ids": data.get('album_ids', []),
        "description": data.get('description', '')
    }
    playlists_col.insert_one(nova_playlist)
    return jsonify({"message": "Playlist criada"}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)