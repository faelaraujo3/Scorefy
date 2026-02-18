from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuração do MongoDB
# "localhost" para correres no teu terminal Debian, "mongodb" se fosses correr dentro do Docker
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["scorefy_db"]

# Coleções (Nomes em português para as variáveis, mas batendo com o MongoDB em inglês)
usuarios_col = db["users"]
artistas_col = db["artists"]
albuns_col = db["albums"]
criticas_col = db["reviews"]

# --- ROTA DE LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')

    # Procura o utilizador no banco (exclui a senha do retorno por segurança)
    usuario = usuarios_col.find_one({"email": email, "senha": senha}, {"_id": 0})

    if not usuario:
        return jsonify({"error": "E-mail ou palavra-passe incorretos"}), 401

    return jsonify({
        "message": "Login realizado com sucesso!",
        "user": usuario
    }), 200

# --- ROTA DE REGISTO ---
@app.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')
    nome = data.get('nome')

    if not email or not senha or not nome:
        return jsonify({"error": "E-mail, senha e nome são obrigatórios"}), 400

    if usuarios_col.find_one({"email": email}):
        return jsonify({"error": "E-mail já cadastrado!"}), 400

    # Estrutura do usuário
    novo_usuario = {
        "email": email,
        "senha": senha,
        "username": "",
        "nome": nome,
        "bio": "",
        "localizacao": "",
        "albuns_favoritos": []
    }
    
    usuarios_col.insert_one(novo_usuario)
    return jsonify({"message": "Conta criada com sucesso!"}), 201

# --- ROTA DE BUSCA INTELIGENTE ---
@app.route('/api/busca', methods=['GET'])
def busca_global():
    termo = request.args.get('q', '')
    if not termo:
        return jsonify({"artistas": [], "albuns": []}), 200

    # 1. Procura artistas e álbuns pelo nome (ignora maiúsculas/minúsculas)
    artistas = list(artistas_col.find({"name": {"$regex": termo, "$options": "i"}}, {"_id": 0}))
    albuns = list(albuns_col.find({"title": {"$regex": termo, "$options": "i"}}, {"_id": 0}))

    # 2. Lógica Inteligente: Se encontrar um artista, traz todos os álbuns dele
    for art in artistas:
        id_artista = art.get("id_artista")
        albuns_do_artista = list(albuns_col.find({"id_artista": id_artista}, {"_id": 0}))
        
        for album in albuns_do_artista:
            if album not in albuns:
                albuns.append(album)

    return jsonify({
        "artistas": artistas,
        "albuns": albuns
    }), 200

# --- ROTA DE LISTAGEM DE ÁLBUNS POR GÉNERO ---
@app.route('/api/albuns', methods=['GET'])
def listar_albuns():
    genero = request.args.get('genero')
    
    # Pipeline para trazer o nome do artista junto com o álbum
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
            "title": 1,
            "genre": 1,
            "year": 1,
            "image": 1,
            "nome_artista": "$artista_info.name"
        }}
    ]
    
    resultados = list(albuns_col.aggregate(pipeline))
    return jsonify(resultados), 200

if __name__ == '__main__':
    # Roda na porta 5000
    app.run(debug=True, host='0.0.0.0', port=5000)