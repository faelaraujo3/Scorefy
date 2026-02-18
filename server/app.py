from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime, timedelta
import os


app = Flask(__name__)
CORS(app)

# MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["scorefy_db"]

# Coleções
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

    # Estrutura inicial do usuário
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
            "description": 1,
            "nome_artista": "$artista_info.name"
        }}
    ]
    
    resultados = list(albuns_col.aggregate(pipeline))
    return jsonify(resultados), 200

@app.route('/api/home/secoes', methods=['GET'])
def obter_secoes_home():
    # 1. MELHORES AVALIAÇÕES (Overall)
    # Agrupa críticas por id_album, calcula média e ordena
    pipeline_top = [
        {"$group": {
            "_id": "$id_album",
            "media": {"$avg": "$rating"},
            "total": {"$sum": 1}
        }},
        {"$sort": {"media": -1, "total": -1}},
        {"$limit": 8}
    ]
    melhores_ids = list(criticas_col.aggregate(pipeline_top))
    
    # 2. EM ALTA (Mais avaliações na última semana)
    uma_semana_atras = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    pipeline_trending = [
        {"$match": {"created_at": {"$gte": uma_semana_atras}}},
        {"$group": {
            "_id": "$id_album",
            "contagem": {"$sum": 1}
        }},
        {"$sort": {"contagem": -1}},
        {"$limit": 8}
    ]
    trending_ids = list(criticas_col.aggregate(pipeline_trending))

    # Função auxiliar para buscar detalhes dos álbuns com Info do Artista
    def buscar_detalhes(lista_agregada):
        ids = [item["_id"] for item in lista_agregada]
        albuns = list(albuns_col.find({"id_album": {"$in": ids}}, {"_id": 0}))
        # Adiciona o nome do artista (lookup manual para simplificar)
        for alubm in albuns:
            art = artistas_col.find_one({"id_artista": alubm["id_artista"]})
            alubm["artist"] = art["name"] if art else "Desconhecido"
        return albuns

    # 3. NOVOS LANÇAMENTOS (Pelo campo 'year' do álbum)
    novos_lancamentos = list(albuns_col.find({}, {"_id": 0}).sort("year", -1).limit(8))
    for nl in novos_lancamentos:
        art = artistas_col.find_one({"id_artista": nl["id_artista"]})
        nl["artist"] = art["name"] if art else "Desconhecido"

    # Se não houver avaliações ainda, retorna álbuns aleatórios para as seções não ficarem vazias
    if not melhores_ids:
        fallback = list(albuns_col.find({}, {"_id": 0}).limit(8))
        for f in fallback:
            art = artistas_col.find_one({"id_artista": f["id_artista"]})
            f["artist"] = art["name"] if art else "Desconhecido"
        return jsonify({
            "trending": fallback,
            "top_rated": fallback,
            "new_releases": novos_lancamentos
        })

    return jsonify({
        "trending": buscar_detalhes(trending_ids),
        "top_rated": buscar_detalhes(melhores_ids),
        "new_releases": novos_lancamentos
    })


# Função auxiliar para formatar a resposta
def formatar_albuns(lista_ids_ou_docs):
    resultados = []
    # Se a lista for de dicionários (agregados), extrai os IDs
    ids = [item["_id"] if "_id" in item else item["id_album"] for item in lista_ids_ou_docs] if lista_ids_ou_docs and isinstance(lista_ids_ou_docs[0], dict) else []
    
    # Se a lista já for de documentos completos (caso do 'novos'), usa direto, senão busca
    if not ids: # Caso seja lista direta de objetos
        albuns_db = lista_ids_ou_docs
    else:
        albuns_db = list(albuns_col.find({"id_album": {"$in": ids}}, {"_id": 0}))

    # Adiciona nome do artista e formata
    for album in albuns_db:
        art = artistas_col.find_one({"id_artista": album["id_artista"]})
        album["artist"] = art["name"] if art else "Desconhecido"
        # Se você já tiver reviews no banco para calcular a nota real, coloque aqui.
        # Por enquanto mantemos fixo ou busca da média se tiver.
        album["rating"] = 4.5 
        resultados.append(album)
    
    return resultados

@app.route('/api/lista/em-alta', methods=['GET'])
def lista_em_alta():
    # Pega tudo da última semana, ordenado por contagem
    uma_semana_atras = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    pipeline = [
        {"$match": {"created_at": {"$gte": uma_semana_atras}}},
        {"$group": {"_id": "$id_album", "contagem": {"$sum": 1}}},
        {"$sort": {"contagem": -1}},
        {"$limit": 50} 
    ]
    ids = list(criticas_col.aggregate(pipeline))
    # Fallback se vazio
    if not ids: return jsonify(formatar_albuns(list(albuns_col.find({}, {"_id": 0}).limit(20))))
    return jsonify(formatar_albuns(ids))

@app.route('/api/lista/melhores', methods=['GET'])
def lista_melhores():
    pipeline = [
        {"$group": {"_id": "$id_album", "media": {"$avg": "$rating"}}},
        {"$sort": {"media": -1}},
        {"$limit": 50}
    ]
    ids = list(criticas_col.aggregate(pipeline))
    if not ids: return jsonify(formatar_albuns(list(albuns_col.find({}, {"_id": 0}).limit(20))))
    return jsonify(formatar_albuns(ids))

@app.route('/api/lista/lancamentos', methods=['GET'])
def lista_lancamentos():
    # Ordena por ano decrescente
    albuns = list(albuns_col.find({}, {"_id": 0}).sort("year", -1).limit(50))
    return jsonify(formatar_albuns(albuns))

if __name__ == '__main__':
    # Roda na porta 5000
    app.run(debug=True, host='0.0.0.0', port=5000)